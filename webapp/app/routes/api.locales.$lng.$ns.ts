import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import type { Route } from "./+types/api.locales.$lng.$ns";

export async function loader({ params }: Route.LoaderArgs) {
  const { lng, ns } = params;
  const allowedLngs = ["de", "en"];
  const allowedNs = ["translation"];
  if (!allowedLngs.includes(lng) || !allowedNs.includes(ns)) {
    return Response.json({}, { status: 404 });
  }
  try {
    const filePath = resolve(`./app/locales/${lng}/${ns}.json`);
    const raw = readFileSync(filePath, "utf-8");
    return new Response(raw, {
      headers: { "Content-Type": "application/json" },
    });
  } catch {
    return Response.json({}, { status: 404 });
  }
}
