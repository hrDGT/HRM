"use client";

import { X } from "lucide-react";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";

type ModalWrapperProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function ModalWrapper({
  open,
  onClose,
  title,
  children,
}: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-main-bg overflow-y-auto max-w-8/10 lg:max-w-4xl sm [&>button]:hidden">
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-xl text-main-text">{title}</DialogTitle>
          <button
            onClick={onClose}
            className="inline-flex justify-center items-center size-8 p-0 text-main-text rounded-full hover:bg-active-sidebar-bg cursor-pointer"
          >
            <X className="size-5.5 stroke-action-color" />
          </button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
