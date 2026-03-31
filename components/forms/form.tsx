"use client";

import * as React from "react";
import {
  FormProvider,
  type UseFormReturn,
  type FieldValues,
} from "react-hook-form";

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  onSubmit: (data: T) => void;
  children: React.ReactNode;
  className?: string;
  id?: string;
}

export function Form<T extends FieldValues>({
  form,
  onSubmit,
  children,
  className,
  id,
}: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form
        id={id}
        onSubmit={form.handleSubmit(onSubmit)}
        className={className}
      >
        {children}
      </form>
    </FormProvider>
  );
}
