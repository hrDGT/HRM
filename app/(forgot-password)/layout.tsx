import { PropsWithChildren } from "react";

export default function ForgotPasswordLayout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="min-h-screen flex flex-col justify-center items-center p-3">
        {children}
      </main>
    </div>
  );
}
