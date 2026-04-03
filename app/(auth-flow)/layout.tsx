import { AuthHeader } from "@/components/auth/auth-header";
import { FadeIn } from "@/components/ui/fade-in";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <main className="min-h-[calc(100vh-56px)] flex flex-col justify-center items-center p-3">
        <FadeIn className="w-full max-w-xl">{children}</FadeIn>
      </main>
    </div>
  );
}
