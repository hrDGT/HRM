"use client";

import { useRef } from "react";

import { GetUserForStoreQuery } from "@/gqlcodegen/graphql";
import { useUserStore } from "@/store/use-user-store";

interface UserProviderProps {
  children: React.ReactNode;
  user: GetUserForStoreQuery["user"] | null;
}

export function UserProvider({ children, user }: UserProviderProps) {
  const isInitialized = useRef(false);

  if (!isInitialized.current) {
    useUserStore.getState().setUser(user);
    isInitialized.current = true;
  }

  return <>{children}</>;
}
