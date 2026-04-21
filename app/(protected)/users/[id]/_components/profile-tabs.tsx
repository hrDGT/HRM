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
              "pb-3 text-xs font-semibold tracking-wider transition-colors relative cursor-pointer",
              isActive ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {tab.label}
            {isActive && (
              <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
            )}
          </Link>
        );
      })}
    </div>
  );
}
