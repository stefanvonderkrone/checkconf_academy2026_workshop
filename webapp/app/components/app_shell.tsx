import type { ReactNode } from "react";

type AppShellProps = {
  title: string;
  children: ReactNode;
};

export function AppShell({ title, children }: AppShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-white">
      <header className="sr-only">
        <h1 className="text-center text-lg font-semibold">{title}</h1>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
