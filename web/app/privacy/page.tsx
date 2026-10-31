import { PrivacyContent } from "@/app/components/LegalContent";

export const metadata = {
  title: "Privacy Policy",
  description: "How Gerard Photo Studio collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <div className="wrap inner legal">
      <h1 className="page-title">Privacy Policy</h1>
      <PrivacyContent />
    </div>
  );
}
