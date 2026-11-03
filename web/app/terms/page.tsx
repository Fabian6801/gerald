import { TermsContent } from "@/app/components/LegalContent";
import PageCloseButton from "@/app/components/PageCloseButton";

export const metadata = {
  title: "Terms & Licensing",
  description: "Booking, payment, delivery, copyright and licensing terms for Gerard Photo Studio.",
};

export default function TermsPage() {
  return (
    <div className="wrap inner legal">
      <PageCloseButton />
      <h1 className="page-title">Terms &amp; Licensing</h1>
      <TermsContent />
    </div>
  );
}
