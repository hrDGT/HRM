import { FieldError } from "../ui/field";

type Props = {
  message?: string;
};

export function FormRootError({ message }: Props) {
  if (!message) return null;

  return <FieldError errors={[{ message }]} />;
}
