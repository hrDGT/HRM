import { ChangeEvent } from "react";
import { Plus, Search } from "lucide-react";

import { Button } from "@/components/ui/button";
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
  actionTitle: string;
};

export function DashboardHeader({
  title,
  searchValue,
  onChange,
  isAdmin,
  actionTitle,
}: Props) {
  return (
    <header className="sticky top-0 bg-main-bg z-10 pt-4">
      <h1 className="text-base text-secondary-text opacity-60 ml-4 mb-4">
        {title}
      </h1>
      <div className="flex justify-between items-center gap-x-4 mx-4 mb-4 min-h-12">
        <InputGroup className="inline-flex gap-x-2.5 w-full max-w-80 rounded-4xl max-h-10 p-3 focus-visible:border-main-text hover:border-main-text">
          <InputGroupInput
            value={searchValue}
            onChange={onChange}
            placeholder="Search"
            className="placeholder:text-secondary-text placeholder:opacity-60 text-base"
            type="search"
            name="search"
          />
          <InputGroupAddon>
            <Search className="size-5 stroke-action-color" />
          </InputGroupAddon>
        </InputGroup>
        {isAdmin && (
          <Button className="gap-x-2 aspect-square text-main-red text-sm uppercase rounded-xl hover:bg-action-hover p-0 md:px-2">
            <Plus className="size-5" />
            <span className="hidden md:block">{actionTitle}</span>
          </Button>
        )}
      </div>
    </header>
  );
}
