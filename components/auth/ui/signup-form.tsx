"use client";

import { startTransition, useActionState, useId } from "react";

import { ControlledPasswordInput } from "@/components/forms/ui/controlled-password-input";
import { Form } from "@/components/forms/ui/form";
import { FormActions } from "@/components/forms/ui/form-actions";
import { FormHeader } from "@/components/forms/ui/form-header";
import { FormInput } from "@/components/forms/ui/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

import { signUpUserAction } from "../actions/signup-action";
import { SignupFormValues, signupSchema } from "../schemas/signup-schema";

import { FormRootError } from "./auth-root-error";

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
            <FormInput
              name="email"
              placeholder="Email"
              autoFocus
              autocompleteValue="email"
            />
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
