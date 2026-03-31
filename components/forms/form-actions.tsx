import Link from "next/link";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { Field } from "../ui/field";

interface FormActionsProps {
  formId: string;
  buttonText: string;
  linkText: string;
  linkHref: string;
}

export function FormActions({
  formId,
  buttonText,
  linkText,
  linkHref,
}: FormActionsProps) {
  return (
    <CardFooter className="justify-center">
      <Field orientation="vertical" className="xl:max-w-56 ">
        <Button
          type="submit"
          form={formId}
          className="mb-2 rounded-4xl xl:min-h-12 self-center uppercase bg-primary hover:brightness-90"
        >
          {buttonText}
        </Button>
        <Button asChild variant="link">
          <Link
            href={linkHref}
            className="inline-flex justify-center items-center uppercase text-sm text-secondary-text font-medium xl:min-h-12"
          >
            {linkText}
          </Link>
        </Button>
      </Field>
    </CardFooter>
  );
}
