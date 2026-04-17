import { create } from "zustand";
import { devtools } from "zustand/middleware";

import { GetUserForStoreQuery } from "@/gqlcodegen/graphql";

type User = GetUserForStoreQuery["user"];

interface UserState {
  user: User | null;
  isAdmin: boolean;
  setUser: (user: User | null) => void;
}

export const useUserStore = create<UserState>()(
  devtools(
    (set) => ({
      user: null,
      isAdmin: false,
      setUser: (user) => set({
        user,
        isAdmin: user?.role === "Admin"
      }),
    }),
    { name: "UserStore" }
  )
);