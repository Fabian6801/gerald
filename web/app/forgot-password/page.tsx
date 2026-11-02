import { Suspense } from "react";
import ForgotPasswordForm from "@/app/components/ForgotPasswordForm";

export const metadata = {
  title: "Reset your password",
  description: "Get an email link to choose a new password.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="wrap inner">
      <Suspense fallback={null}>
        <ForgotPasswordForm />
      </Suspense>
    </div>
  );
}
