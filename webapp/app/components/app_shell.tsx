import type { ReactNode } from "react";

type AppShellProps = {
  title: string;
  children: ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-40 bg-primary px-4 py-3 pt-safe-top text-white shadow-md">
        <h1 className="text-center text-lg font-semibold">{title}</h1>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
