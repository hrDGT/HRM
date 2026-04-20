"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
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
      <DialogContent className="bg-[#1e1e1e] text-zinc-200 w-full max-w-[95vw] min-w-[50vw] h-auto max-h-[90vh] overflow-y-auto sm:rounded-xl p-8">
        <DialogHeader className="pb-4 border-b border-white/10 mb-6">
          <DialogTitle className="text-base font-semibold text-zinc-100">
            {title}
          </DialogTitle>
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
