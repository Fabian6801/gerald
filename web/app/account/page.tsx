import AccountView from "@/app/components/AccountView";

export const metadata = {
  title: "My account",
  description: "Your Gerard Photo Studio account and booking requests.",
  robots: { index: false, follow: false },
};

export default function AccountPage() {
  return <AccountView />;
}
