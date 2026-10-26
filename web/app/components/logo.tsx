"use client";
import { useState } from "react";

export default function Logo() {
  const [loaded, setLoaded] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className="logo-box">
      {!loaded && <span aria-hidden="true">G</span>}
      {!failed && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src="/images/logo.png"
          alt="Gerard Photo Studio logo"
          ref={(el) => {
            if (el && el.complete) {
              if (el.naturalWidth === 0) setFailed(true);
              else setLoaded(true);
            }
          }}
          onLoad={() => setLoaded(true)}
          onError={() => setFailed(true)}
        />
      )}
    </div>
  );
}