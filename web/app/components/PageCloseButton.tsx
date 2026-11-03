"use client";
import { useRouter } from "next/navigation";

// Round X at the top right of the Terms and Privacy pages: goes back to where the visitor came from
export default function PageCloseButton() {
  const router = useRouter();

  function close() {
    if (window.history.length > 1) router.back();
    else router.push("/");
  }

  return (
    <button type="button" className="legal-close page-close" aria-label="Close and go back" onClick={close}>
      &times;
    </button>
  );
}
