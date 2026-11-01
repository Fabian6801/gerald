"use client";
import { useEffect, useState } from "react";
import { useOnline } from "@/app/lib/useOnline";

// Tells the visitor when they lose the connection, and when it comes back.
// The page content stays on screen the whole time.
export default function OfflineBanner() {
  const online = useOnline();
  const [wasOffline, setWasOffline] = useState(false);
  const [backOnline, setBackOnline] = useState(false);

  useEffect(() => {
    if (!online) {
      setWasOffline(true);
      setBackOnline(false);
      return;
    }
    if (wasOffline) {
      setBackOnline(true);
      const timer = setTimeout(() => setBackOnline(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [online, wasOffline]);

  if (!online) {
    return (
      <div className="net-banner net-offline" role="status">
        <i className="fa-solid fa-wifi" aria-hidden="true"></i>
        <span>You are offline. You can keep reading what has loaded. Booking works again when you reconnect.</span>
      </div>
    );
  }
  if (backOnline) {
    return (
      <div className="net-banner net-online" role="status">
        <i className="fa-solid fa-circle-check" aria-hidden="true"></i>
        <span>Back online.</span>
      </div>
    );
  }
  return null;
}
