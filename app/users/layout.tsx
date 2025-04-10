"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Users, Lightbulb, Languages, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const NAV_ITEMS = [
  { label: "Employees", icon: Users, href: "/users" },
  { label: "Skills", icon: Lightbulb, href: "/skills" },
  { label: "Languages", icon: Languages, href: "/languages" },
  { label: "CVs", icon: FileText, href: "/cvs" },
];

export default function UsersLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-[#353535] text-zinc-200 overflow-hidden">
      <aside
        className={cn(
          "flex-shrink-0 bg-[#353535] flex flex-col transition-all duration-300 ease-in-out",
          isExpanded ? "w-56" : "w-16"
        )}
      >
        <nav className="flex-1 py-4 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const active = pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-4xl rounded-l-lg text-sm font-medium transition-colors",
                  active
                    ? "bg-white/10 text-white"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-white/5"
                )}
              >
                <Icon size={16} className={cn("flex-shrink-0", active ? "text-white" : "text-zinc-500")} />
                <span className={cn("whitespace-nowrap transition-opacity duration-200", isExpanded ? "block" : "hidden")}>
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="py-4 space-y-3">
          <Link 
            href="/users/me"
            className={cn(
              "flex items-center px-3 gap-2 hover:bg-white/5 rounded-lg py-1 transition-colors cursor-pointer"
            )}
          >
            <Avatar className="h-7 w-7 flex-shrink-0">
              <AvatarFallback className="bg-orange-500 text-white text-xs font-bold">
                R
              </AvatarFallback>
            </Avatar>
            <span className={cn("text-sm text-zinc-300 truncate transition-opacity duration-200", isExpanded ? "block" : "hidden")}>
              Rostislav Harlanov
            </span>
          </Link>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? "Свернуть меню" : "Развернуть меню"}
            className="flex items-center justify-start w-full py-1.5 px-3 rounded-4xl rounded-l-lg transition-colors cursor-pointer hover:bg-white/5"
          >
            <ChevronLeft
              size={24}
              className={cn(
                "text-zinc-400 transition-transform duration-300",
                !isExpanded && "rotate-180"
              )}
            />
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        {children}
      </main>
    </div>
  );
}
