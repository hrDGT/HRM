"use client";

import { useEffect, useRef } from "react";

import { GetUserForStoreQuery } from "@/gqlcodegen/graphql";
import { useUserStore } from "@/store/use-user-store";

interface UserProviderProps {
  children: React.ReactNode;
  user: GetUserForStoreQuery["user"] | null;
}

export function UserProvider({ children, user }: UserProviderProps) {
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!hasInitialized.current && user) {
      useUserStore.getState().setUser(user);
      hasInitialized.current = true;
    }
  }, [user]);

  return <>{children}</>;
}
