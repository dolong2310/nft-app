import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

interface GlobalStoreProps {
  isFirstTime: boolean;
  setIsFirstTime: (isFirstTime: boolean) => void;

  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
}

export const useGlobalStore = create<GlobalStoreProps>()(
  devtools(
    persist(
      (set) => ({
        isFirstTime: true,
        setIsFirstTime: (isFirstTime) => set({ isFirstTime }),

        _hasHydrated: false,
        setHasHydrated: (state) => {
          set({
            _hasHydrated: state,
          });
        },
      }),
      {
        name: "global",
        onRehydrateStorage: (state) => {
          return () => state.setHasHydrated(true);
        },
      }
    )
  )
);
