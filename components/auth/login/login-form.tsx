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

import { loginUserAction } from "./login-action";
import { LoginFormValues, loginSchema } from "./login-schema";

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
