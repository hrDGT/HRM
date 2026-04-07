import { CardDescription, CardHeader, CardTitle } from "../ui/card";

type Props = {
  title: string;
  description: string;
};

export function FormHeader({ title, description }: Props) {
  return (
    <CardHeader className="text-center">
      <CardTitle className="text-4xl mb-5 font-normal">{title}</CardTitle>
      <CardDescription className="text-base mb-6">
        {description}
      </CardDescription>
    </CardHeader>
  );
}
