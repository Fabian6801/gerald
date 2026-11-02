import { Suspense } from "react";
import LoginForm from "@/app/components/LoginForm";

export const metadata = {
  title: "Log in",
  description: "Log in to your Gerard Photo Studio account to follow your booking requests.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <div className="wrap inner">
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
