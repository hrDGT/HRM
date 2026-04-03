import { FieldError } from "./field";

interface FormRootErrorProps {
  message?: string;
}

export function FormRootError({ message }: FormRootErrorProps) {
  if (!message) return null;

  return (
    <div className="mt-2">
      <FieldError errors={[{ message }]} />
    </div>
  );
}
