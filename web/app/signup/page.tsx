import { Suspense } from "react";
import SignupForm from "@/app/components/SignupForm";

export const metadata = {
  title: "Create account",
  description: "Create a Gerard Photo Studio account to book faster and follow your booking requests.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="wrap inner">
      <Suspense fallback={null}>
        <SignupForm />
      </Suspense>
    </div>
  );
}
