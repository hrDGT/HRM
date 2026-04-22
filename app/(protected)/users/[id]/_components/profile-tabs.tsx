"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
  href: string;
};

type ProfileTabsProps = {
  tabs: Tab[];
  userId: string;
};

export function ProfileTabs({ tabs, userId }: ProfileTabsProps) {
  const pathname = usePathname();

  return (
    <div className="flex gap-8">
      {tabs.map((tab) => {
        const isActive =
          pathname === tab.href ||
          (tab.id !== "profile" && pathname?.startsWith(tab.href));

        return (
          <Link
            key={tab.id}
            href={tab.href}
            className={cn(
              "pt-3 px-4 text-sm font-medium tracking-wider transition-colors relative cursor-pointer",
              isActive
                ? "text-primary"
                : "text-main-text hover:text-secondary-text",
            )}
          >
            {tab.label}
            {isActive && (
              <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-primary" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
