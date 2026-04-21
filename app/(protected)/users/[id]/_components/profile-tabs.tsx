"use client";

import { cn } from "@/lib/utils";

type Tab = {
  id: string;
  label: string;
};

type ProfileTabsProps = {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
};

export function ProfileTabs({ tabs, activeTab, onTabChange }: ProfileTabsProps) {
  return (
    <div className="flex gap-8">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => onTabChange(tab.id)}
          className={cn(
            "pb-3 text-xs font-semibold tracking-wider transition-colors relative cursor-pointer",
            activeTab === tab.id ? "text-red-500" : "text-zinc-500 hover:text-zinc-300"
          )}
        >
          {tab.label}
          {activeTab === tab.id && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500" />
          )}
        </button>
      ))}
    </div>
  );
}
