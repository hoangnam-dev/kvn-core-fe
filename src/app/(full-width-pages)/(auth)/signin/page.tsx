import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign in",
  description: "KVN Core",
};

export default function SignIn() {
  return (
      <Suspense fallback={<div>Loading...</div>}>
        <SignInForm />
      </Suspense>
  );
}
