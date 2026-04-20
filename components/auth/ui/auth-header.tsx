"use client";

import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";

import { AuthTab } from "./auth-tab";

export function AuthHeader() {
  const t = useTranslations("Auth.header");
  const tabs = [
    { title: t("loginLinkTitle"), href: "/auth/login" },
    { title: t("signUpLinkTitle"), href: "/auth/signup" },
  ];
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => pathname === tab.href);
  const isSignup = activeIndex === 1;

  return (
    <header className="flex justify-center pt-1.5 max-h-13.5">
      <nav className="relative flex justify-center w-full max-w-75">
        {tabs.map(({ title, href }) => {
          return (
            <div key={href} className="flex-1 flex justify-center text-center">
              <AuthTab title={title} href={href} />
            </div>
          );
        })}
        <div
          className={cn(
            "absolute -bottom-0.5 left-0 h-0.5 w-1/2 bg-main-red transition-transform duration-300 ease-out",
            {
              "translate-x-full": isSignup,
              "translate-x-0": !isSignup,
            },
          )}
        />
      </nav>
    </header>
  );
}
