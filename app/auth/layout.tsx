import { PropsWithChildren } from "react";

import { AuthHeader } from "@/components/auth/ui/auth-header";
import { FadeIn } from "@/components/ui/fade-in";

export default function AuthLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <AuthHeader />
      <main className="min-h-[calc(100vh-56px)] flex flex-col justify-center items-center p-3">
        <FadeIn className="w-full max-w-xl">{children}</FadeIn>
      </main>
    </div>
  );
}
