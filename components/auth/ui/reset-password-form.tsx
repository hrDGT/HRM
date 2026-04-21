"use client";

import { startTransition, useActionState, useId } from "react";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";

import { useActionFeedback } from "@/components/auth/hooks/use-action-feedback";
import { ControlledPasswordInput } from "@/components/forms/ui/controlled-password-input";
import { Form } from "@/components/forms/ui/form";
import { FormActions } from "@/components/forms/ui/form-actions";
import { FormHeader } from "@/components/forms/ui/form-header";
import { Card, CardContent } from "@/components/ui/card";
import { ActionState } from "@/lib/auth/auth-types";

import { resetPasswordAction } from "../actions/reset-password-action";
import {
  getResetPasswordSchema,
  type ResetPasswordFormValues,
} from "../schemas/reset-password-schema";

import { FormRootError } from "./auth-root-error";

export function ResetPasswordForm() {
  const t = useTranslations("Auth.resetPassword");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Common.validation");
  const id = useId();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const actionWrapper = async (
    state: ActionState,
    data: ResetPasswordFormValues,
  ) => {
    return resetPasswordAction(token, state, data);
  };

  const [state, formAction, isPending] = useActionState(actionWrapper, null);

  const handleFormSubmit = (data: ResetPasswordFormValues) => {
    startTransition(() => {
      formAction(data);
    });
  };

  useActionFeedback(state?.success, t("success"), "/auth/login");

  return (
    <Card className="w-full max-w-xl">
      <FormHeader title={t("title")} description={t("subtitle")} />
      <CardContent className="mb-14">
        <Form
          className="space-y-2"
          id={id}
          schema={getResetPasswordSchema(tValidation)}
          defaultValues={{ newPassword: "" }}
          onSubmit={handleFormSubmit}
        >
          <ControlledPasswordInput
            name="newPassword"
            placeholder={tCommon("fields.newPassword")}
            autoComplete="new-password"
            autoFocus
            hasProtectIcon={false}
          />
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId={id}
        buttonText={t("submitAction")}
        linkText={t("backToLoginAction")}
        linkHref="/auth/login"
        isPending={isPending}
      />
    </Card>
  );
}
