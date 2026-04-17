"use client";

import { ReactNode, useState } from "react";
import { DefaultValues, FieldValues } from "react-hook-form";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";
import { ZodType } from "zod";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import { Form } from "./form";
import { ModalSubmitButton } from "./modal-submit-button";

interface BaseFormModalProps<T extends FieldValues> {
  actionTitle: string;
  schema: ZodType<T>;
  defaultValues: DefaultValues<T>;
  onSubmit: (data: T, closeModal: () => void) => void;
  isPending: boolean;
  children: ReactNode;
  submitButtonTitleOnFetch?: string;
  submitButtonTitle?: string;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

export function BaseFormModal<T extends FieldValues>({
  actionTitle,
  schema,
  defaultValues,
  onSubmit,
  isPending,
  children,
  submitButtonTitleOnFetch,
  submitButtonTitle,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
}: BaseFormModalProps<T>) {
  const t = useTranslations("Common");
  const [internalOpen, setInternalOpen] = useState(false);

  const controlled = controlledOnOpenChange !== undefined;
  const isOpen = controlled ? Boolean(controlledOpen) : internalOpen;

  const setIsOpen = (next: boolean) => {
    if (controlled) {
      controlledOnOpenChange(next);
    } else {
      setInternalOpen(next);
    }
  };
  const handleFormSubmit = (data: T) => {
    onSubmit(data, () => setIsOpen(false));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent
        className="bg-white max-w-8/10 md:max-w-xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">{actionTitle}</DialogTitle>

          <DialogDescription className="sr-only">
            {actionTitle}
          </DialogDescription>

          <DialogClose asChild>
            <Button
              type="button"
              variant="ghost"
              className="absolute right-2 top-2 size-8 p-0 text-main-text rounded-full hover:bg-action-hover"
            >
              <X className="size-5.5 stroke-action-color" />
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
              className="min-w-50 min-h-12 text-secondary-text rounded-4xl uppercase hover:bg-action-hover"
            >
              {t("actions.cancel")}
            </Button>
            <ModalSubmitButton
              isPending={isPending}
              title={submitButtonTitle || t("actions.create")}
              titleOnFetch={submitButtonTitleOnFetch || t("actions.creating")}
            />
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
