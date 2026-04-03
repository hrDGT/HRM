import { FadeIn } from "@/components/ui/fade-in";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col justify-center items-center p-3">
      <FadeIn className="w-full sm:max-w-xl">{children}</FadeIn>
    </div>
  );
}
