"use client";

import { ReactNode, useState } from "react";
import { useTranslations } from "next-intl";
import { X } from "lucide-react";

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

interface BaseAlertModalProps {
  title: string;
  description?: string;
  itemName: string;
  onConfirm: () => void;
  isPending: boolean;
  trigger?: ReactNode;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  confirmText?: string;
  confirmingText?: string;
}

export function BaseAlertModal({
  title,
  description,
  itemName,
  onConfirm,
  isPending,
  trigger,
  open: controlledOpen,
  onOpenChange: controlledOnOpenChange,
  confirmText,
  confirmingText,
}: BaseAlertModalProps) {
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

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {trigger ? <DialogTrigger asChild>{trigger}</DialogTrigger> : null}

      <DialogContent
        className="bg-white max-w-8/10 md:max-w-xl"
        showCloseButton={false}
      >
        <DialogHeader>
          <DialogTitle className="text-xl">{title}</DialogTitle>

          {description && (
            <DialogDescription className="text-main-text pt-2 text-base">
              {description}
              {itemName && <b> {itemName}</b>}?
            </DialogDescription>
          )}

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
          <Button
            type="button"
            onClick={() => onConfirm()}
            disabled={isPending}
            className="min-w-50 min-h-12 rounded-4xl max-h-10 bg-main-red text-white uppercase shadow-btn hover:bg-main-red-hover border-transparent"
          >
            {isPending
              ? confirmingText || t("actions.confirming")
              : confirmText || t("actions.confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
