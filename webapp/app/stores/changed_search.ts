import { create } from "zustand";

type ChangedSearchLocation = {
  pathname: string;
  search: string;
  originalSearch: string;
  key: string;
  idx: number;
};

type ChangedSearchState = {
  previous: ChangedSearchLocation[];
  current: ChangedSearchLocation;
  next: ChangedSearchLocation[];
  push: (location: ChangedSearchLocation) => void;
  replace: (location: ChangedSearchLocation) => void;
  pop: (location: ChangedSearchLocation) => void;
  update: (params: { changed: URLSearchParams; removed: URLSearchParams }) => void;
};

const initialLocation: ChangedSearchLocation = {
  pathname: "/",
  search: "",
  originalSearch: "",
  key: "",
  idx: 0,
};

export const useChangedSearchStore = create<ChangedSearchState>((set) => ({
  previous: [],
  current: initialLocation,
  next: [],

  push(location) {
    set((old) => ({
      previous: [...old.previous, old.current],
      current: location,
      next: [],
    }));
  },

  replace(location) {
    set((old) => ({
      ...old,
      current: location,
    }));
  },

  pop(location) {
    set((old) => {
      for (let i = old.previous.length - 1; i >= 0; i--) {
        if (old.previous[i]?.key === location.key) {
          return {
            previous: old.previous.slice(0, i),
            current: old.previous[i]!,
            next: [old.current, ...old.previous.slice(i + 1), ...old.next],
          };
        }
      }

      for (let i = 0; i < old.next.length; i++) {
        if (old.next[i]?.key === location.key) {
          return {
            previous: [...old.previous, old.current, ...old.next.slice(0, i)],
            current: old.next[i]!,
            next: old.next.slice(i + 1),
          };
        }
      }

      return old;
    });
  },

  update({ changed, removed }) {
    set((state) => ({
      ...state,
      previous: state.previous.map((location) => {
        const url = new URL(
          location.pathname + location.search,
          window.location.origin,
        );

        for (const [key, value] of changed.entries()) {
          url.searchParams.set(key, value);
        }

        for (const [key] of removed.entries()) {
          url.searchParams.delete(key);
        }

        const newSearch = url.searchParams.toString();
        return {
          ...location,
          search: newSearch ? `?${newSearch}` : "",
        };
      }),
    }));
  },
}));
