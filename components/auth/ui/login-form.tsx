"use client";

import { startTransition, useActionState, useId } from "react";
import { useTranslations } from "next-intl";

import { ControlledPasswordInput } from "@/components/forms/ui/controlled-password-input";
import { Form } from "@/components/forms/ui/form";
import { FormActions } from "@/components/forms/ui/form-actions";
import { FormHeader } from "@/components/forms/ui/form-header";
import { FormInput } from "@/components/forms/ui/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

import { loginUserAction } from "../actions/login-action";
import { getLoginSchema, type LoginFormValues } from "../schemas/login-schema";

import { FormRootError } from "./auth-root-error";

export function LoginForm() {
  const t = useTranslations("Auth.login");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Common.validation");
  const id = useId();
  const [state, formAction, isPending] = useActionState(loginUserAction, null);

  const handleFormSubmit = (values: LoginFormValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Card>
      <FormHeader title={t("title")} description={t("subtitle")} />
      <CardContent className="mb-14">
        <Form
          className="space-y-2"
          id={id}
          schema={getLoginSchema(tValidation)}
          defaultValues={{ email: "", password: "" }}
          onSubmit={handleFormSubmit}
        >
          <FieldGroup className="gap-y-4">
            <FormInput
              name="email"
              placeholder={tCommon("fields.email")}
              autoFocus
              autocompleteValue="email"
            />
            <ControlledPasswordInput
              name="password"
              placeholder={tCommon("fields.password")}
              autoComplete="current-password"
            />
          </FieldGroup>
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId={id}
        buttonText={t("submitAction")}
        linkText={t("forgotPasswordAction")}
        linkHref="/forgot-password"
        isPending={isPending}
      />
    </Card>
  );
}
