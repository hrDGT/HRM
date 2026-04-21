"use client";

import { X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";

type ModalWrapperProps = {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
};

export function ModalWrapper({ open, onClose, title, children }: ModalWrapperProps) {
  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#2c2c2c] text-zinc-200 w-full max-w-[95vw] min-w-[50vw] h-auto max-h-[90vh] overflow-y-auto sm:rounded-xl p-8 [&>button]:hidden">
        <div className="flex items-center justify-between mb-6">
          <DialogTitle className="text-base font-semibold text-zinc-100">
            {title}
          </DialogTitle>
          <button
            onClick={onClose}
            className="text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>
        {children}
      </DialogContent>
    </Dialog>
  );
}
