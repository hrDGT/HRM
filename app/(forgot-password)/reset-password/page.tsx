import { Suspense } from "react";
import { Metadata } from "next";

import { ResetPasswordForm } from "@/components/auth/ui/reset-password-form";
import { DashboardLoader } from "@/components/ui/loader";

export const metadata: Metadata = {
  title: "HRM | Reset Password",
  description: "Choose a strong new password to secure your account access.",
};

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<DashboardLoader />}>
      <ResetPasswordForm />
    </Suspense>
  );
}
