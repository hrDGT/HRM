"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogOut, Settings, User } from "lucide-react";
import {
  Briefcase,
  Building2,
  ChevronLeft,
  FileUser,
  Folders,
  Languages,
  TrendingUp,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { type StoreUser, useUserStore } from "@/store/use-user-store";

import { logoutAction } from "../auth/actions/logout-action";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

export type ProtectedLayoutClientProps = {
  children: React.ReactNode;
  initialUser?: StoreUser | null;
};

const PROFILE_LINK_CLASS =
  "flex items-center px-3 gap-2 hover:bg-active-sidebar-bg rounded-l-lg rounded-4xl py-1 transition-colors cursor-pointer";

export function ProtectedLayoutClient({
  initialUser,
  children,
}: ProtectedLayoutClientProps) {
  const t = useTranslations("Users");
  const pathname = usePathname();
  const [isExpanded, setIsExpanded] = useState(true);

  const { setUser, user, clearUser } = useUserStore();
  const router = useRouter();

  const handleLogout = async () => {
    clearUser();
    await logoutAction();
    router.push("/auth/login");
    router.refresh();
  };

  useEffect(() => {
    if (initialUser) {
      setUser(initialUser);
    }
  }, [initialUser, setUser]);

  const initials = user
    ? `${user.profile.first_name?.[0] ?? ""}${user.profile.last_name?.[0] ?? ""}`.toUpperCase() ||
      "U"
    : "U";

  const displayName = user
    ? `${user.profile.first_name ?? ""} ${user.profile.last_name ?? ""}`.trim() ||
      t("defaultUser")
    : t("defaultUser");

  const NAV_ITEMS = [
    { label: t("title"), icon: Users, href: "/users" },
    { label: t("nav.projects"), icon: Folders, href: "/projects" },
    { label: t("nav.cvs"), icon: FileUser, href: "/cvs" },
    { label: t("nav.department"), icon: Building2, href: "/departments" },
    { label: t("nav.positions"), icon: Briefcase, href: "/positions" },
    { label: t("nav.skills"), icon: TrendingUp, href: "/skills" },
    { label: t("nav.languages"), icon: Languages, href: "/languages" },
  ];

  return (
    <div className="flex h-screen bg-main-bg text-main-text overflow-hidden">
      <aside
        className={cn(
          "pt-11 pb-4 shrink-0 flex flex-col transition-all duration-300 ease-in-out",
          isExpanded ? "w-56" : "w-16",
        )}
      >
        <nav className="flex flex-col gap-y-3.5 flex-1 space-y-1">
          {NAV_ITEMS.map(({ label, icon: Icon, href }) => {
            const active =
              pathname === href || pathname?.startsWith(`${href}/`);
            return (
              <Link
                key={label}
                href={href}
                className={cn(
                  "flex items-center gap-3 px-4 py-2.5 min-h-14 rounded-4xl rounded-l-lg text-base font-medium transition-colors",
                  active
                    ? "bg-active-sidebar-bg text-main-text"
                    : "text-secondary-text hover:text-main-text hover:bg-active-sidebar-bg",
                )}
              >
                <Icon
                  size={24}
                  className={cn(
                    "shrink-0",
                    active ? "text-main-text" : "text-action-btn",
                  )}
                />
                <span
                  className={cn(
                    "whitespace-nowrap transition-opacity duration-200",
                    isExpanded ? "block" : "hidden",
                  )}
                >
                  {label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="py-4 space-y-3">
          <DropdownMenu>
            <DropdownMenuTrigger
              className={cn(
                PROFILE_LINK_CLASS,
                "w-full text-left outline-none border-none",
              )}
            >
              <Avatar className="h-10 w-10 shrink-0">
                {user?.profile.avatar && (
                  <AvatarImage src={user.profile.avatar} />
                )}
                <AvatarFallback className="bg-primary text-primary-foreground text-xs font-bold">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span
                className={cn(
                  "text-base text-main-text truncate transition-opacity duration-200",
                  isExpanded ? "block" : "hidden",
                )}
              >
                {displayName}
              </span>
            </DropdownMenuTrigger>

            <DropdownMenuContent
              side="top"
              align="start"
              sideOffset={10}
              className="w-56 bg-main-bg border-main-border shadow-action-menu rounded-lg p-2"
            >
              <DropdownMenuItem
                asChild
                className="cursor-pointer py-2.5 px-3 hover:bg-active-sidebar-bg focus:bg-active-sidebar-bg rounded-md text-main-text"
              >
                <Link href="/users/me" className="flex items-center w-full">
                  <User className="mr-3 h-5 w-5 stroke-[2.5]" />
                  <span className="text-base font-medium">
                    {t("profileMenu")}
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuItem
                asChild
                className="cursor-pointer py-2.5 px-3 hover:bg-active-sidebar-bg focus:bg-active-sidebar-bg rounded-md text-main-text"
              >
                <Link href="/settings" className="flex items-center w-full">
                  <Settings className="mr-3 h-5 w-5 stroke-[2.5]" />
                  <span className="text-base font-medium">
                    {t("settingsMenu")}
                  </span>
                </Link>
              </DropdownMenuItem>

              <DropdownMenuSeparator className="bg-main-border my-1" />

              <DropdownMenuItem
                className="cursor-pointer py-2.5 px-3 hover:bg-active-sidebar-bg focus:bg-active-sidebar-bg rounded-md text-main-text"
                onClick={handleLogout}
              >
                <LogOut className="mr-3 h-5 w-5 stroke-[2.5]" />
                <span className="text-base font-medium">{t("logoutMenu")}</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <button
            onClick={() => setIsExpanded((prev) => !prev)}
            aria-label={isExpanded ? t("collapseMenu") : t("expandMenu")}
            className="flex items-center justify-start w-full py-1.5 px-3 rounded-4xl rounded-l-lg transition-colors cursor-pointer hover:bg-active-sidebar-bg"
          >
            <ChevronLeft
              size={24}
              className={cn(
                "text-action-btn transition-transform duration-300",
                !isExpanded && "rotate-180",
              )}
            />
          </button>
        </div>
      </aside>

      <div className="flex-1 flex flex-col max-w-7xl mx-auto overflow-hidden">
        {children}
      </div>
    </div>
  );
}
