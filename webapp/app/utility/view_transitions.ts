import type { HistoryBus as HistoryBusType } from "./history_bus";

type Direction = "forward" | "backward" | "none";

let currentIdx = 0;
let lastPathname = typeof window !== "undefined" ? window.location.pathname : "/";
let setDirectionFn: ((d: Direction) => void) | null = null;

export function setDirectionSetter(fn: (d: Direction) => void) {
  setDirectionFn = fn;
}

function setDirection(d: Direction) {
  setDirectionFn?.(d);
}

export function patchHistory(bus: typeof HistoryBusType) {
  if (typeof window === "undefined") return;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = function (
    state: unknown,
    title: string,
    url?: string | URL | null,
  ) {
    currentIdx++;
    const patchedState = { ...(state as Record<string, unknown> | null), __idx: currentIdx };
    originalPushState(patchedState, title, url);

    const newPathname = window.location.pathname;
    if (newPathname !== lastPathname) {
      setDirection("forward");
    } else {
      setDirection("none");
    }
    lastPathname = newPathname;

    bus.notify("PUSH", {
      pathname: window.location.pathname,
      search: window.location.search,
      state: patchedState as { key?: string; idx?: number },
    });
  };

  window.history.replaceState = function (
    state: unknown,
    title: string,
    url?: string | URL | null,
  ) {
    const patchedState = { ...(state as Record<string, unknown> | null), __idx: currentIdx };
    originalReplaceState(patchedState, title, url);
    setDirection("none");

    bus.notify("REPLACE", {
      pathname: window.location.pathname,
      search: window.location.search,
      state: patchedState as { key?: string; idx?: number },
    });
  };

  window.addEventListener("popstate", (event) => {
    const state = event.state as { __idx?: number; key?: string } | null;
    const newIdx = state?.__idx ?? 0;
    const newPathname = window.location.pathname;

    if (newPathname !== lastPathname) {
      setDirection(newIdx < currentIdx ? "backward" : "forward");
    } else {
      setDirection("none");
    }

    currentIdx = newIdx;
    lastPathname = newPathname;

    bus.notify("POP", {
      pathname: window.location.pathname,
      search: window.location.search,
      state: state as { key?: string; idx?: number },
    });
  });
}
