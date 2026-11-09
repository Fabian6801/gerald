import { PrivacyContent } from "@/app/components/LegalContent";
import LegalSheet from "@/app/components/LegalSheet";

export const metadata = {
  title: "Privacy Policy",
  description: "How Gerard Photo Studio collects, uses and protects your personal information.",
};

export default function PrivacyPage() {
  return (
    <LegalSheet title="Privacy Policy">
      <PrivacyContent />
    </LegalSheet>
  );
}
