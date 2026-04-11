"use client";

import { startTransition, useActionState, useId } from "react";

import { ControlledPasswordInput } from "@/components/forms/ui/controlled-password-input";
import { Form } from "@/components/forms/ui/form";
import { FormActions } from "@/components/forms/ui/form-actions";
import { FormHeader } from "@/components/forms/ui/form-header";
import { ControlledInput } from "@/components/forms/ui/form-input";
import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";

import { loginUserAction } from "../actions/login-action";
import { LoginFormValues, loginSchema } from "../schemas/login-schema";

import { FormRootError } from "./auth-root-error";

export function LoginForm() {
  const id = useId();
  const [state, formAction, isPending] = useActionState(loginUserAction, null);

  const handleFormSubmit = (values: LoginFormValues) => {
    startTransition(() => {
      formAction(values);
    });
  };

  return (
    <Card>
      <FormHeader
        title="Welcome back"
        description="Hello again! Log in to continue"
      />
      <CardContent className="mb-14">
        <Form
          className="space-y-2"
          id={id}
          schema={loginSchema}
          defaultValues={{ email: "", password: "" }}
          onSubmit={handleFormSubmit}
        >
          <FieldGroup className="gap-y-4">
            <ControlledInput name="email" placeholder="Email" autoFocus />
            <ControlledPasswordInput
              name="password"
              placeholder="Password"
              autoComplete="current-password"
            />
          </FieldGroup>
          <FormRootError message={state?.error} />
        </Form>
      </CardContent>
      <FormActions
        formId={id}
        buttonText="Log in"
        linkText="Forgot password"
        linkHref="/forgot-password"
        isPending={isPending}
      />
    </Card>
  );
}
