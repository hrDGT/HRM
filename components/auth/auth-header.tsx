"use client";

import { usePathname } from "next/navigation";
import { AuthTab } from "./auth-tab";

const tabs = [
  { title: "Sign In", href: "/auth/login" },
  { title: "Sign Up", href: "/auth/signup" },
];

export function AuthHeader() {
  const pathname = usePathname();
  const activeIndex = tabs.findIndex((tab) => pathname === tab.href);
  const isSignup = activeIndex === 1;

  return (
    <header className="flex justify-center pt-1.5 max-h-[54px]">
      <nav className="relative flex justify-center w-full max-w-[300px]">
        {tabs.map(({ title, href }) => {
          return (
            <div key={href} className="flex-1 flex justify-center text-center">
              <AuthTab title={title} href={href} />
            </div>
          );
        })}
        <div
          className={`absolute -bottom-0.5 left-0 h-0.5 w-1/2 bg-main-red transition-transform duration-300 ease-out ${
            isSignup ? "translate-x-full" : "translate-x-0"
          }`}
        />
      </nav>
    </header>
  );
}
