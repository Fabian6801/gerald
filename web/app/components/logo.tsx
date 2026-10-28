"use client";
import { useEffect, useRef } from "react";
import { assets } from "@/app/lib/assets";

export default function Logo() {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const v = ref.current;
    if (!v) return;
    v.muted = true; // browsers only allow autoplay when the video is muted
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reduce) v.play().catch(() => {});
  }, []);

  return (
    <div className="logo-box">
      <video
        ref={ref}
        src={assets.logoVideo}
        poster={assets.logoPoster}
        muted
        loop
        playsInline
        preload="auto"
        aria-label="Kim Gerard logo"
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transform: "scale(1.8)",
        }}
      />
    </div>
  );
}