"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/Lib/supabase";

type Item = { url: string; alt: string; title: string };
type Row = { image_url: string | null; title: string | null; description: string | null };

const FIRST = 8;        // photos shown before the "Show all" button
const PLACEHOLDERS = 8; // coloured blocks shown while there are no photos yet

function Photo({ item, i }: { item?: Item; i: number }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const alt = item?.alt || `Photo ${i + 1}`;

  // No photo yet, or it failed to load: show a coloured block
  if (!item || failedUrl === item.url) {
    return (
      <div className="ph" role="img" aria-label={alt}>
        Photo {i + 1}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={item.url}
      alt={alt}
      decoding="async"
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailedUrl(item.url);
      }}
      onError={() => setFailedUrl(item.url)}
    />
  );
}

export default function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [showAll, setShowAll] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);

  // Load every photo listed in the Supabase "portfolio" table, newest first
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("portfolio")
        .select("image_url, title, description")
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Could not load portfolio:", error.message);
        return;
      }
      if (cancelled || !data) return;

      const list: Item[] = [];
      for (const row of data as Row[]) {
        if (!row.image_url) continue;
        list.push({
          url: row.image_url,
          alt: row.title || row.description || "Photograph by Kim Gerard",
          title: row.title || "Gallery",
        });
      }
      setItems(list);
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const total = items.length || PLACEHOLDERS;
  const shown = showAll ? total : Math.min(FIRST, total);
  const current = idx !== null ? items[idx] : undefined;

  function openLB(i: number) {
    setIdx(i);
    dialogRef.current?.showModal();
  }
  function step(d: number) {
    setIdx((i) => (i === null ? i : (i + d + total) % total));
  }

  useEffect(() => {
    if (idx !== null) thumbRefs.current[idx]?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [idx]);

  return (
    <>
      <section id="gallery" className="sec" aria-labelledby="gallery-h">
        <div className="wrap">
          <h2 id="gallery-h" className="sec-title">Gallery</h2>
          <p className="sec-sub">A selection of recent work</p>

          <div className="gallery-grid">
            {Array.from({ length: shown }, (_, i) => (
              <button
                key={i}
                type="button"
                className="gcell"
                aria-label={`Open photo ${i + 1}`}
                onClick={() => openLB(i)}
              >
                <Photo item={items[i]} i={i} />
              </button>
            ))}
          </div>

          {total > FIRST && (
            <div className="gallery-more">
              <button type="button" className="btn-outline-dark" onClick={() => setShowAll((v) => !v)}>
                {showAll ? "Show fewer photos" : `Show all ${total} photos`}
              </button>
            </div>
          )}
        </div>
      </section>

      {/* LIGHTBOX */}
      <dialog
        ref={dialogRef}
        className="lightbox"
        aria-label="Photo viewer"
        onClick={(e) => { if (e.target === e.currentTarget) dialogRef.current?.close(); }}
        onKeyDown={(e) => {
          if (e.key === "ArrowLeft") step(-1);
          if (e.key === "ArrowRight") step(1);
        }}
      >
        <div className="lb-head">
          <h2>
            <span className="lb-title">{current?.title ?? "Gallery"}</span>
            <span className="lb-count">{idx !== null ? `${idx + 1} / ${total}` : ""}</span>
          </h2>
          <button className="lb-close" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>&times;</button>
        </div>

        <div className="lb-main">
          <button className="lb-nav lb-prev" type="button" aria-label="Previous photo" onClick={() => step(-1)}>&#8249;</button>
          <div className="lb-stage">
            {current && (
              <div
                className="lb-bg"
                aria-hidden="true"
                style={{ backgroundImage: `url(${JSON.stringify(current.url)})` }}
              />
            )}
            {idx !== null && <Photo key={idx} item={current} i={idx} />}
          </div>
          <button className="lb-nav lb-next" type="button" aria-label="Next photo" onClick={() => step(1)}>&#8250;</button>
        </div>

        <div className="lb-thumbs">
          {idx !== null &&
            Array.from({ length: total }, (_, k) => (
              <button
                key={k}
                ref={(el) => { thumbRefs.current[k] = el; }}
                type="button"
                className={k === idx ? "on" : ""}
                aria-label={`Photo ${k + 1}`}
                onClick={() => setIdx(k)}
              >
                <Photo item={items[k]} i={k} />
              </button>
            ))}
        </div>
      </dialog>
    </>
  );
}
