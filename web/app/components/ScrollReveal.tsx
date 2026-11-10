"use client";
import { useEffect } from "react";

// Things that fade in and rise as they scroll into view
const TARGETS = [
  ".sec-title", ".sec-sub", ".gallery-tabs", ".gcell", ".gallery-more",
  ".svc-card", ".svc-more", ".svc-detail", ".quote-card",
  ".about-photo-wrap", ".about-intro-text", ".about-grid > div",
  ".contact-strip", ".book-section .booking-form", ".book-layout > *", ".book-note",
  ".page-title", ".site-footer",
].join(",");

// Boxes whose children appear one after another (a small delay between neighbours)
const GROUPS = ".gallery-grid, .svc-grid, .svc-detail-grid, .quote-grid, .about-grid, .book-layout";

// Add this component once, in app/layout.tsx. It needs no changes to the pages themselves.
export default function ScrollReveal() {
  useEffect(() => {
    if (typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return; // no animation for these visitors

    const seen = new WeakSet<Element>();
    let firstScan = true;
    let frame = 0;

    // Plays the animation, then removes the helper classes so hover effects work again
    function play(el: HTMLElement) {
      el.classList.add("in-view");
      let timer = 0;
      const finish = () => {
        el.classList.remove("reveal", "in-view");
        el.style.removeProperty("--reveal-delay");
        el.removeEventListener("animationend", onEnd);
        window.clearTimeout(timer);
      };
      const onEnd = (e: AnimationEvent) => {
        if (e.target === el) finish();
      };
      el.addEventListener("animationend", onEnd);
      timer = window.setTimeout(finish, 2200);
    }

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          io.unobserve(entry.target);
          play(entry.target as HTMLElement);
        }
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 }
    );

    function scan() {
      frame = 0;
      document.querySelectorAll<HTMLElement>(TARGETS).forEach((el) => {
        if (seen.has(el)) return;
        seen.add(el);

        const rect = el.getBoundingClientRect();
        const onScreen = rect.bottom > 0 && rect.top < window.innerHeight * 0.92;
        if (firstScan && onScreen) return; // already visible when the page opened: leave it as it is

        let delay = 0;
        const parent = el.parentElement;
        if (parent && parent.matches(GROUPS)) {
          delay = (Array.from(parent.children).indexOf(el) % 4) * 80; // a row of up to 4 appears left to right
        } else if (el.matches(".sec-sub")) {
          delay = 90;
        }
        el.style.setProperty("--reveal-delay", `${delay}ms`);
        el.classList.add("reveal");

        if (onScreen) play(el); // appeared on screen later, for example the gallery photos after they load
        else io.observe(el);
      });
      firstScan = false;
    }

    // New content (a page change, the gallery loading, a different gallery tab) gets the same treatment
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(scan);
    };
    const mutations = new MutationObserver(schedule);
    mutations.observe(document.body, { childList: true, subtree: true });
    scan();

    // Safety net: never leave something hidden on screen
    const safety = window.setTimeout(() => {
      document.querySelectorAll<HTMLElement>(".reveal:not(.in-view)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.bottom > 0 && r.top < window.innerHeight) play(el);
      });
    }, 3500);

    return () => {
      io.disconnect();
      mutations.disconnect();
      window.clearTimeout(safety);
      if (frame) cancelAnimationFrame(frame);
    };
  }, []);

  return null;
}
