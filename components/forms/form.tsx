"use client";

import {
  FormProvider,
  useForm,
  type FieldValues,
  type DefaultValues,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type ZodType } from "zod";

interface FormProps<T extends FieldValues> extends Omit<
  React.FormHTMLAttributes<HTMLFormElement>,
  "onSubmit"
> {
  schema: ZodType<T>;
  onSubmit: (data: T) => void;
  defaultValues?: DefaultValues<T>;
  id: string;
}

export function Form<T extends FieldValues>({
  schema,
  defaultValues,
  onSubmit,
  children,
  id,
  ...props
}: FormProps<T>) {
  const methods = useForm<T>({
    // eslint-disable-next-line
    resolver: zodResolver(schema as any),
    defaultValues,
  });

  return (
    <FormProvider {...methods}>
      <form id={id} onSubmit={methods.handleSubmit(onSubmit)} {...props}>
        {children}
      </form>
    </FormProvider>
  );
}
