import { Metadata } from "next";
import { ResetPasswordForm } from "@/components/auth/reset-password/reset-password-form";

export const metadata: Metadata = {
  title: "HRM | Reset Password",
  description: "Choose a strong new password to secure your account access.",
};

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
