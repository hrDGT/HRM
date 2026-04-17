"use client";

import { useFormContext } from "react-hook-form";

import { Button } from "@/components/ui/button";

type Props = {
  isPending: boolean;
  title: string;
  titleOnFetch: string;
};

export function ModalSubmitButton({ isPending, title, titleOnFetch }: Props) {
  const {
    formState: { isDirty },
  } = useFormContext();

  return (
    <Button
      type="submit"
      variant="outline"
      disabled={isPending || !isDirty}
      className="min-w-50 min-h-12 rounded-4xl max-h-10 bg-main-red border-transparent text-white uppercase shadow-btn hover:bg-main-red-hover"
    >
      {isPending ? titleOnFetch : title}
    </Button>
  );
}
