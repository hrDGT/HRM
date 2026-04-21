import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { UserRole } from "@/gqlcodegen/graphql";

export type StoreUser = {
  id: string;
  role: UserRole;
  profile: {
    first_name: string | null;
    last_name: string | null;
    avatar: string | null;
  };
};

interface UserState {
  user: StoreUser | null;
  isAdmin: boolean;
  setUser: (user: StoreUser | null) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isAdmin: false,
      setUser: (user) => set({
        user,
        isAdmin: user?.role === UserRole.Admin
      }),
      clearUser: () => set({ user: null, isAdmin: false }),
    }),
    { name: "UserStore" }
  )
);