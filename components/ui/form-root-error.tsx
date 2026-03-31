import { FieldError } from "./field";

interface FormRootErrorProps {
  message?: string;
}

export const FormRootError = ({ message }: FormRootErrorProps) => {
  if (!message) return null;

  return (
    <div className="mt-2">
      <FieldError errors={[{ message }]} />
    </div>
  );
};
