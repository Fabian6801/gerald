import LogoutView from "@/app/components/LogoutView";

export const metadata = {
  title: "Log out",
  description: "Log out of your Gerard Photo Studio account.",
  robots: { index: false, follow: false },
};

export default function LogoutPage() {
  return (
    <div className="wrap inner">
      <LogoutView />
    </div>
  );
}
