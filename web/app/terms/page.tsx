import { TermsContent } from "@/app/components/LegalContent";
import LegalSheet from "@/app/components/LegalSheet";

export const metadata = {
  title: "Terms & Licensing",
  description: "Booking, payment, delivery, copyright and licensing terms for Gerard Photo Studio.",
};

export default function TermsPage() {
  return (
    <LegalSheet title="Terms & Licensing">
      <TermsContent />
    </LegalSheet>
  );
}
