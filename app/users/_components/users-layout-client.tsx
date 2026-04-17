"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { Users, Lightbulb, Languages, FileText, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

type UsersLayoutClientProps = {
  currentUser: {
    id: string | number;
    firstName: string;
    lastName: string;
    avatar: string | null;
  } | null;
  children: React.ReactNode;
};

const PROFILE_LINK_CLASS = "flex items-center px-3 gap-2 hover:bg-white/5 rounded-l-lg rounded-4xl py-1 transition-colors cursor-pointer";

export function UsersLayoutClient({ currentUser, children }: UsersLayoutClientProps) {
  const t = useTranslations("Users");
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const NAV_ITEMS = [
    { label: t("title"), icon: Users, href: "/users" },
    { label: t("nav.skills"), icon: Lightbulb, href: "/skills" },
    { label: t("nav.languages"), icon: Languages, href: "/languages" },
    { label: t("nav.cvs"), icon: FileText, href: "/cvs" },
  ];

  const initials = currentUser
    ? `${currentUser.firstName?.[0] ?? ""}${currentUser.lastName?.[0] ?? ""}`.toUpperCase() || "U"
    : "U";

  const displayName = currentUser
    ? `${currentUser.firstName} ${currentUser.lastName}`.trim() || t("defaultUser")
    : t("defaultUser");

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
            className={PROFILE_LINK_CLASS}
          >
            <Avatar className="h-7 w-7 flex-shrink-0">
              {currentUser?.avatar && <AvatarImage src={currentUser.avatar} />}
              <AvatarFallback className="bg-red-500 text-white text-xs font-bold">
                {initials}
              </AvatarFallback>
            </Avatar>
            <span className={cn("text-sm text-zinc-300 truncate transition-opacity duration-200", isExpanded ? "block" : "hidden")}>
              {displayName}
            </span>
          </Link>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? t("collapseMenu") : t("expandMenu")}
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
