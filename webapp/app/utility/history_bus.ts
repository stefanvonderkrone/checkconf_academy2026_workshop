type HistoryLocation = {
  pathname: string;
  search: string;
  state: { key?: string; idx?: number } | null;
};

type Action = "PUSH" | "REPLACE" | "POP";
type Handler = (action: Action, location: HistoryLocation) => void;

const handlers = new Set<Handler>();

export const HistoryBus = {
  subscribe(handler: Handler) {
    handlers.add(handler);
    return () => {
      handlers.delete(handler);
    };
  },
  notify(action: Action, location: HistoryLocation) {
    for (const handler of handlers) {
      handler(action, location);
    }
  },
};

export function patchHistory() {
  if (typeof window === "undefined") return;

  const originalPushState = window.history.pushState.bind(window.history);
  const originalReplaceState = window.history.replaceState.bind(window.history);

  window.history.pushState = function (
    state: unknown,
    title: string,
    url?: string | URL | null,
  ) {
    originalPushState(state, title, url);
    HistoryBus.notify("PUSH", {
      pathname: window.location.pathname,
      search: window.location.search,
      state: state as { key?: string; idx?: number } | null,
    });
  };

  window.history.replaceState = function (
    state: unknown,
    title: string,
    url?: string | URL | null,
  ) {
    originalReplaceState(state, title, url);
    HistoryBus.notify("REPLACE", {
      pathname: window.location.pathname,
      search: window.location.search,
      state: state as { key?: string; idx?: number } | null,
    });
  };

  window.addEventListener("popstate", (event) => {
    HistoryBus.notify("POP", {
      pathname: window.location.pathname,
      search: window.location.search,
      state: event.state as { key?: string; idx?: number } | null,
    });
  });
}
