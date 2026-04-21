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
      useUserStore.getState().setUser({
        ...user,
        profile: {
          ...user.profile,
          first_name: user.profile?.first_name ?? null,
          last_name: user.profile?.last_name ?? null,
          avatar: user.profile?.avatar ?? null,
        },
      });
      hasInitialized.current = true;
    }
  }, [user]);

  return <>{children}</>;
}
