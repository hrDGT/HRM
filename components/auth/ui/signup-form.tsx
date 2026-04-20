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

import { signUpUserAction } from "../actions/signup-action";
import {
  getSignupSchema,
  type SignupFormValues,
} from "../schemas/signup-schema";

import { FormRootError } from "./auth-root-error";

export function SignupForm() {
  const t = useTranslations("Auth.signUp");
  const tCommon = useTranslations("Common");
  const tValidation = useTranslations("Common.validation");
  const id = useId();
  const [state, formAction, isPending] = useActionState(signUpUserAction, null);

  const handleFormSubmit = (values: SignupFormValues) => {
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
          schema={getSignupSchema(tValidation)}
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
              autoComplete="new-password"
            />
          </FieldGroup>
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId={id}
        buttonText={t("submitAction")}
        linkText={t("haveAccountAction")}
        linkHref="/auth/login"
        isPending={isPending}
      />
    </Card>
  );
}
