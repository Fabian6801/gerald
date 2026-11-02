import { Suspense } from "react";
import ResetPasswordForm from "@/app/components/ResetPasswordForm";

export const metadata = {
  title: "Choose a new password",
  description: "Choose a new password for your Gerard Photo Studio account.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="wrap inner">
      <Suspense fallback={null}>
        <ResetPasswordForm />
      </Suspense>
    </div>
  );
}
