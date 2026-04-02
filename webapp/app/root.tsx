import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";
import type { ReactNode } from "react";
import { useViewTransitionStore } from "~/stores/view_transition";
import "./tailwind.css";

export function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <head>
        <meta charSet="utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, user-scalable=no, viewport-fit=cover"
        />
        <Meta />
        <Links />
      </head>
      <body className="bg-gray-50 pb-safe-bottom min-h-screen text-base">
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  const direction = useViewTransitionStore((s) => s.direction);

  const viewTransitionName =
    direction === "forward"
      ? "page-default-forward"
      : direction === "backward"
        ? "page-default-backward"
        : undefined;

  return (
    <div style={{ viewTransitionName }}>
      <Outlet />
    </div>
  );
}
