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
