"use client";

import { Card, CardContent } from "@/components/ui/card";
import { FieldGroup } from "@/components/ui/field";
import { Form } from "@/components/forms/form";
import { ControlledInput } from "@/components/forms/controlled-input";
import { ControlledPasswordInput } from "@/components/forms/controlled-password-input";
import { useSignUpForm } from "@/app/hooks/auth/use-signup-form";
import { FormHeader } from "@/components/forms/form-header";
import { FormActions } from "@/components/forms/form-actions";
import { FormRootError } from "@/components/ui/form-root-error";

export default function SignupPage() {
  const { form, onSubmit, isPending, rootError } = useSignUpForm();

  return (
    <div className="min-h-screen flex justify-center items-center container mx-auto animate-in fade-in zoom-in-90 slide-in-from-bottom-6 duration-500">
      <Card className="w-full sm:max-w-xl">
        <FormHeader
          title="Register now"
          description="Welcome! Sign up to continue"
        />
        <CardContent className="xl:mb-14">
          <Form id="signup-form" onSubmit={onSubmit} form={form}>
            <FieldGroup className="gap-y-4">
              <ControlledInput name="email" placeholder="Email" autoFocus />
              <ControlledPasswordInput name="password" placeholder="Password" />
            </FieldGroup>
            <FormRootError message={rootError} />
          </Form>
        </CardContent>
        <FormActions
          formId="signup-form"
          buttonText="Create account"
          linkText="I have an account"
          linkHref="/auth/signin"
          isPending={isPending}
        />
      </Card>
    </div>
  );
}
