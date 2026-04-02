import { create } from "zustand";

type AppHeaderData = {
  title: string;
  type: "default" | "overlay";
  icon: "arrow" | "cross";
};

type AppHeaderStore = {
  header: AppHeaderData;
  setHeader: (data: Partial<AppHeaderData>) => void;
};

export const useAppHeaderStore = create<AppHeaderStore>((set) => ({
  header: { title: "", type: "default", icon: "arrow" },
  setHeader: (data) =>
    set((state) => ({ header: { ...state.header, ...data } })),
}));
