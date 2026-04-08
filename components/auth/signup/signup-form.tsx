"use client";

import { startTransition, useActionState, useId } from "react";

import { ControlledPasswordInput } from "@/components/forms/controlled-password-input";
import { Form } from "@/components/forms/form";
import { FormActions } from "@/components/forms/form-actions";
import { FormHeader } from "@/components/forms/form-header";
import { ControlledInput } from "@/components/forms/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

import { FormRootError } from "../auth-root-error";

import { signUpUserAction } from "./signup-action";
import { SignupFormValues, signupSchema } from "./signup-schema";

export function SignupForm() {
  const id = useId();
  const [state, formAction, isPending] = useActionState(signUpUserAction, null);

  const handleFormSubmit = (values: SignupFormValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Card>
      <FormHeader
        title="Register now"
        description="Welcome! Sign up to continue"
      />
      <CardContent className="mb-14">
        <Form
          className="space-y-2"
          id={id}
          schema={signupSchema}
          defaultValues={{ email: "", password: "" }}
          onSubmit={handleFormSubmit}
        >
          <FieldGroup className="gap-y-4">
            <ControlledInput name="email" placeholder="Email" autoFocus />
            <ControlledPasswordInput
              name="password"
              placeholder="Password"
              autoComplete="new-password"
            />
          </FieldGroup>
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId={id}
        buttonText="Create account"
        linkText="I have an account"
        linkHref="/auth/login"
        isPending={isPending}
      />
    </Card>
  );
}
