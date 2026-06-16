import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { HistoryBus } from "~/utility/history_bus";
import { useChangedSearchStore } from "~/stores/changed_search";

export function useChangedSearch() {
  const location = useLocation();
  const navigate = useNavigate();
  const { current: changedSearchLocation } = useChangedSearchStore();

  useEffect(() => {
    return HistoryBus.subscribe((action, loc) => {
      const newLocation = {
        pathname: loc.pathname,
        search: loc.search,
        originalSearch: loc.search,
        key: loc.state?.key ?? "",
        idx: loc.state?.idx ?? 0,
      };

      const store = useChangedSearchStore.getState();
      if (action === "PUSH") store.push(newLocation);
      if (action === "REPLACE") store.replace(newLocation);
      if (action === "POP") store.pop(newLocation);
    });
  }, []);

  useEffect(() => {
    if (
      changedSearchLocation.pathname === location.pathname &&
      changedSearchLocation.search !== location.search &&
      changedSearchLocation.originalSearch === location.search
    ) {
      void navigate(
        {
          pathname: location.pathname,
          search: changedSearchLocation.search,
        },
        { replace: true, preventScrollReset: true },
      );
    }
  }, [changedSearchLocation, location.pathname, location.search, navigate]);
}

export function useApplyChangedSearch() {
  const navigate = useNavigate();
  const location = useLocation();

  return (newParams: Record<string, string | undefined>) => {
    const prevSearchParams = new URLSearchParams(location.search);
    const nextSearchParams = new URLSearchParams(location.search);

    for (const [key, value] of Object.entries(newParams)) {
      if (value !== undefined && value !== "") {
        nextSearchParams.set(key, value);
      } else {
        nextSearchParams.delete(key);
      }
    }

    const changed = new URLSearchParams();
    const removed = new URLSearchParams();

    for (const [key, value] of nextSearchParams.entries()) {
      if (prevSearchParams.get(key) !== value) {
        changed.set(key, value);
      }
    }
    for (const [key] of prevSearchParams.entries()) {
      if (!nextSearchParams.has(key)) {
        removed.set(key, "");
      }
    }

    useChangedSearchStore.getState().update({ changed, removed });

    const search = nextSearchParams.toString();
    void navigate(
      { pathname: location.pathname, search: search ? `?${search}` : "" },
      { replace: true },
    );
  };
}
