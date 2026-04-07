import Link from "next/link";
import { Button } from "../ui/button";
import { CardFooter } from "../ui/card";
import { Field } from "../ui/field";

type Props = {
  formId: string;
  buttonText: string;
  linkText: string;
  linkHref: string;
  isPending: boolean;
};

export function FormActions({
  formId,
  buttonText,
  linkText,
  linkHref,
  isPending,
}: Props) {
  return (
    <CardFooter className="justify-center">
      <Field orientation="vertical" className="max-w-56 ">
        <Button
          type="submit"
          form={formId}
          disabled={isPending}
          className="self-center mb-2 rounded-4xl min-h-12 uppercase bg-primary hover:brightness-90"
        >
          {isPending ? "Loading..." : buttonText}
        </Button>
        <Button asChild variant="link">
          <Link
            href={linkHref}
            className="inline-flex justify-center items-center uppercase text-sm text-secondary-text font-medium min-h-12"
          >
            {linkText}
          </Link>
        </Button>
      </Field>
    </CardFooter>
  );
}
