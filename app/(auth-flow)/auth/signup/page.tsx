import { Metadata } from "next";
import SignupForm from "./signup-form";

export const metadata: Metadata = {
  title: "HRM | Sign Up",
  description:
    "Create a new account to start managing your human resources efficiently.",
};

export default function SignupPage() {
  return <SignupForm />;
}
