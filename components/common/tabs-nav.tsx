"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export type TabItem = {
  id: string;
  label: string;
  href?: string;
  onClick?: () => void;
};

export type TabsNavProps = {
  tabs: TabItem[];
  activeId?: string;
  className?: string;
};

export function TabsNav({ tabs, activeId, className }: TabsNavProps) {
  const pathname = usePathname();

  return (
    <div className={cn("flex gap-8", className)}>
      {tabs.map((tab) => {
        const isActive = activeId
          ? tab.id === activeId
          : (tab.href && pathname === tab.href);

        const content = (
          <>
            {tab.label}
            {isActive && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />}
          </>
        );

        if (tab.href && !tab.onClick) {
          return (
            <Link
              key={tab.id}
              href={tab.href}
              className={cn(
                "pb-3 text-xs font-semibold tracking-wider transition-colors relative cursor-pointer",
                isActive ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
              )}
            >
              {content}
            </Link>
          );
        }

        return (
          <button
            key={tab.id}
            onClick={tab.onClick}
            className={cn(
              "pb-3 text-xs font-semibold tracking-wider transition-colors relative cursor-pointer",
              isActive ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
            )}
          >
            {content}
          </button>
        );
      })}
    </div>
  );
}
