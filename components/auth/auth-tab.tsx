"use client";

import { cn } from "@/lib/utils";
import Link, { type LinkProps } from "next/link";
import { usePathname } from "next/navigation";

type Props = {
  title: string;
  href: LinkProps["href"];
};

export function AuthTab({ title, href }: Props) {
  const pathname = usePathname();
  const isActive = pathname === href.toString();

  return (
    <Link
      href={href}
      className={cn(
        "w-full flex justify-center items-center py-3.5 min-h-12 text-sm font-medium uppercase",

        "transition-all duration-200 active:translate-y-0.5",
        isActive ? "text-main-red" : "text-secondary-text hover:text-main-text",
      )}
    >
      {title}
    </Link>
  );
}
