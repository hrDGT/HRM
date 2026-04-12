"use client";

import { ReactNode, useState } from "react";
import { DefaultValues, FieldValues } from "react-hook-form";
import { Plus } from "lucide-react";
import { X } from "lucide-react";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Form } from "./form";

interface BaseFormModalProps<T extends FieldValues> {
  actionTitle: string;
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T, closeModal: () => void) => void;
  isPending: boolean;
  children: ReactNode;
}

export function BaseFormModal<T extends FieldValues>({
  actionTitle,
  schema,
  defaultValues,
  onSubmit,
  isPending,
  children,
}: BaseFormModalProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const handleFormSubmit = (data: T) => {
    onSubmit(data, () => setIsOpen(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="gap-x-2 aspect-square text-main-red text-sm uppercase rounded-xl hover:bg-action-hover p-0 md:px-2">
          <Plus className="size-5" />
          <span className="hidden md:block">{actionTitle}</span>
        </Button>
      </DialogTrigger>

      <DialogContent
        className="bg-white max-w-8/10  md:max-w-2xl"
        showCloseButton={false}
        aria-describedby={actionTitle}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">{actionTitle}</DialogTitle>
          <DialogClose asChild className="absolute right-2 top-2 size-6 p-0">
            <Button type="button" className="text-main-text p-2">
              <X />
            </Button>
          </DialogClose>
        </DialogHeader>

        <Form
          id="universal-form"
          schema={schema}
          defaultValues={defaultValues}
          onSubmit={handleFormSubmit}
        >
          <div className="py-2 space-y-4">{children}</div>

          <DialogFooter className="border-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
              disabled={isPending}
              className="min-w-40 rounded-xl max-h-10 hover:bg-action-hover"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="outline"
              disabled={isPending}
              className="min-w-40 rounded-xl max-h-10 hover:bg-action-hover"
            >
              {isPending ? "Saving..." : "Create"}
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
