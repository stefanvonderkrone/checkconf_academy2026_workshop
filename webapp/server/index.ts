import express from "express";
import compression from "compression";
import fs from "node:fs";
import type { ServerBuild } from "react-router";

const app = express();
app.use(compression());

const SOCKET_PATH =
  process.env.SOCKET === "true" ? "/app/sockets/webapp.sock" : null;
const PORT = Number(process.env.PORT ?? 4321);

if (process.env.NODE_ENV !== "production") {
  const vite = await import("vite");
  const viteServer = await vite.createServer({
    server: { middlewareMode: true },
  });
  app.use(viteServer.middlewares);

  app.all("/{*path}", async (req, res, next) => {
    const mod = await viteServer.ssrLoadModule(
      "virtual:react-router/server-build",
    );
    const handler = (
      await import("@react-router/express")
    ).createRequestHandler({ build: mod as never });
    return handler(req, res, next);
  });
} else {
  app.use(
    "/assets",
    express.static("build/client/assets", {
      immutable: true,
      maxAge: "1y",
    }),
  );
  app.use(express.static("build/client", { maxAge: "1h" }));

  const build = await import('virtual:react-router/server-build') as unknown as ServerBuild;
  const { createRequestHandler } = await import("@react-router/express");
  app.all("/{*path}", createRequestHandler({ build: build as never }));
}

if (SOCKET_PATH) {
  if (fs.existsSync(SOCKET_PATH)) fs.unlinkSync(SOCKET_PATH);
  app.listen(SOCKET_PATH, () => {
    fs.chmodSync(SOCKET_PATH, "666");
    console.log(`Listening on ${SOCKET_PATH}`);
  });
} else {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Listening on http://0.0.0.0:${PORT}`);
  });
}
