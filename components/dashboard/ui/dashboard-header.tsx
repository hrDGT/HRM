"use client";

import { ChangeEvent, ReactNode } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

type Props = {
  title: string;
  searchValue: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  isAdmin: boolean;
  createModal: ReactNode;
};

export function DashboardHeader({
  title,
  searchValue,
  onChange,
  isAdmin,
  createModal,
}: Props) {
  const t = useTranslations("Common");
  return (
    <header className="shrink-0 bg-main-bg pt-4">
      <h1 className="text-base text-secondary-text opacity-70 ml-4 mb-4">
        {title}
      </h1>
      <div className="flex justify-between items-center gap-x-4 mx-4 mb-4 min-h-12">
        <InputGroup className="inline-flex gap-x-2.5 w-full max-w-80 rounded-4xl max-h-10 p-3 focus-visible:border-main-text hover:border-main-text">
          <InputGroupInput
            value={searchValue}
            onChange={onChange}
            placeholder={t("actions.search")}
            className="placeholder:text-secondary-text placeholder:opacity-60 text-base"
            type="search"
            name="search"
          />
          <InputGroupAddon>
            <Search className="size-5 stroke-action-color" />
          </InputGroupAddon>
        </InputGroup>
        {isAdmin && createModal}
      </div>
    </header>
  );
}
