"use client";

import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ModalWrapper } from "@/components/ui/modal-wrapper";
import { cn } from "@/lib/utils";

type DeleteUserModalProps = {
  open: boolean;
  onClose: () => void;
  onDelete: () => Promise<void>;
  isPending: boolean;
  userName: string;
};

export function DeleteUserModal({ open, onClose, onDelete, isPending, userName }: DeleteUserModalProps) {
  const c = useTranslations("Common");
  const t = useTranslations("Users");

  const handleDelete = async () => {
    try {
      await onDelete();
      onClose();
    } catch (err) {
      console.error("Delete user failed:", err);
    }
  };

  return (
    <ModalWrapper open={open} onClose={onClose} title={t("dialog.deleteUserTitle")}>
      <div className="space-y-6">
        <p className="text-sm text-zinc-400 leading-relaxed">
          {t("dialog.deleteUserMessage", { name: userName })}
        </p>

        <div className="flex justify-end w-full mt-6 pt-4 border-t border-white/10">
          <div className="w-full max-w-xs flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isPending}
              className="flex-1 uppercase text-xs tracking-widest text-zinc-400 hover:text-zinc-200 bg-transparent hover:bg-white/5 border-white/10 rounded-4xl"
            >
              {c("actions.cancel")}
            </Button>
            <Button
              onClick={handleDelete}
              disabled={isPending}
              className={cn(
                "flex-1 uppercase text-xs tracking-widest rounded-4xl transition-all duration-300",
                isPending
                  ? "bg-zinc-600 text-zinc-400 cursor-not-allowed"
                  : "bg-red-500 hover:bg-red-600 text-zinc-100 cursor-pointer"
              )}
            >
              {isPending ? c("actions.deleting") : c("actions.delete")}
            </Button>
          </div>
        </div>
      </div>
    </ModalWrapper>
  );
}
