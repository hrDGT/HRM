import { Metadata } from "next";
import LoginForm from "../../../../components/auth/login-form";

export const metadata: Metadata = {
  title: "HRM | Login",
  description: "Sign in to your account to access the HRM dashboard.",
};

export default function LoginPage() {
  return <LoginForm />;
}
