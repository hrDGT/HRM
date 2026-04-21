"use client";

import { startTransition, useActionState, useId } from "react";
import { useTranslations } from "next-intl";

import { useActionFeedback } from "@/components/auth/hooks/use-action-feedback";
import { Form } from "@/components/forms/ui/form";
import { FormActions } from "@/components/forms/ui/form-actions";
import { FormHeader } from "@/components/forms/ui/form-header";
import { FormInput } from "@/components/forms/ui/form-input";
import { Card, CardContent } from "@/components/ui/card";

import { forgotPasswordAction } from "../actions/forgot-password-action";
import {
  type ForgotPasswordFormValues,
  getForgotPasswordSchema,
} from "../schemas/forgot-password-schema";

import { FormRootError } from "./auth-root-error";

export function ForgotPasswordForm() {
  const t = useTranslations("Auth.forgotPassword");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Common.validation");
  const id = useId();
  const [state, formAction, isPending] = useActionState(
    forgotPasswordAction,
    null,
  );

  useActionFeedback(state?.success, t("success"), "/auth/login");

  const handleFormSubmit = (values: ForgotPasswordFormValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Card className="w-full max-w-xl">
      <FormHeader title={t("title")} description={t("subtitle")} />
      <CardContent className="mb-14">
        <Form
          className="space-y-2"
          id={id}
          schema={getForgotPasswordSchema(tValidation)}
          defaultValues={{ email: "" }}
          onSubmit={handleFormSubmit}
        >
          <FormInput
            name="email"
            placeholder={tCommon("fields.email")}
            autoFocus
            autocompleteValue="email"
          />
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId={id}
        buttonText={t("submitAction")}
        linkText={t("cancelAction")}
        linkHref="/auth/login"
        isPending={isPending}
      />
    </Card>
  );
}
