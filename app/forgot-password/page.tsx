import { Metadata } from "next";
import ForgotPasswordForm from "./forgot-password-form";

export const metadata: Metadata = {
  title: "HRM | Forgot Password",
  description:
    "Enter your email to receive a password reset link and recover your account.",
};

export default function ForgotPasswordPage() {
  return <ForgotPasswordForm />;
}
