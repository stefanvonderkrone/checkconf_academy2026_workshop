import { create } from "zustand";

type Direction = "forward" | "backward" | "none";

type ViewTransitionStore = {
  direction: Direction;
  setDirection: (d: Direction) => void;
};

export const useViewTransitionStore = create<ViewTransitionStore>((set) => ({
  direction: "none",
  setDirection: (direction) => set({ direction }),
}));
