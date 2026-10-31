"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { supabase } from "@/Lib/supabase";

type Item = { url: string; alt: string; title: string; group: string };
type Row = {
  image_url: string | null;
  title: string | null;
  description: string | null;
  category: string | null;
};
type Status = "loading" | "ready" | "error";

const FIRST = 8; // photos shown before the "Show all" button
const ORDER = ["Weddings", "Portraits", "Events", "Fashion", "Commercial", "Travel & Landscape"];

// Turns the text in the table's "category" column into a tab name
function groupOf(category: string | null): string {
  const v = (category || "").trim().toLowerCase();
  if (!v) return "More";
  if (/wedding|bride|bridal|groom/.test(v)) return "Weddings";
  if (/portrait|family|maternity|graduation|headshot/.test(v)) return "Portraits";
  if (/event|birthday|conference|party|launch/.test(v)) return "Events";
  if (/fashion|editorial|model/.test(v)) return "Fashion";
  if (/commercial|product|brand|food/.test(v)) return "Commercial";
  if (/travel|landscape|nature|scenic/.test(v)) return "Travel & Landscape";
  return v.charAt(0).toUpperCase() + v.slice(1);
}

function Photo({ item, sizes }: { item: Item; sizes: string }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="ph" role="img" aria-label={item.alt}>
        Photo unavailable
      </div>
    );
  }
  return <Image src={item.url} alt={item.alt} fill sizes={sizes} onError={() => setFailed(true)} />;
}

export default function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [tab, setTab] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [idx, setIdx] = useState<number | null>(null);

  // Load every photo listed in the Supabase "portfolio" table, newest first
  useEffect(() => {
    let cancelled = false;

    async function load() {
      const { data, error } = await supabase
        .from("portfolio")
        .select("image_url, title, description, category")
        .order("created_at", { ascending: false });

      if (cancelled) return;
      if (error || !data) {
        console.error("Could not load portfolio:", error?.message);
        setStatus("error");
        return;
      }

      const list: Item[] = [];
      for (const row of data as Row[]) {
        if (!row.image_url) continue;
        list.push({
          url: row.image_url,
          alt: row.title || row.description || "Photograph by Kim Gerard",
          title: row.title || "Gallery",
          group: groupOf(row.category),
        });
      }
      setItems(list);
      setStatus("ready");
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const groups = useMemo(() => {
    const present = Array.from(new Set(items.map((i) => i.group)));
    const known = ORDER.filter((g) => present.includes(g));
    const other = present.filter((g) => !ORDER.includes(g)).sort();
    return [...known, ...other];
  }, [items]);

  const filtered = tab === "All" ? items : items.filter((i) => i.group === tab);
  const total = filtered.length;
  const shown = showAll ? total : Math.min(FIRST, total);
  const current = idx !== null ? filtered[idx] : undefined;

  function openLB(i: number) {
    setIdx(i);
    dialogRef.current?.showModal();
  }
  function step(d: number) {
    if (total === 0) return;
    setIdx((i) => (i === null ? i : (i + d + total) % total));
  }
  function chooseTab(g: string) {
    setTab(g);
    setShowAll(false);
    setIdx(null);
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

          {groups.length > 1 && (
            <div className="gallery-tabs" role="group" aria-label="Filter photos by category">
              {["All", ...groups].map((g) => (
                <button key={g} type="button" className="tab" aria-pressed={tab === g} onClick={() => chooseTab(g)}>
                  {g}
                </button>
              ))}
            </div>
          )}

          {status === "loading" && (
            <div className="gallery-grid" aria-hidden="true">
              {Array.from({ length: FIRST }, (_, i) => (
                <div key={i} className="gcell skeleton" />
              ))}
            </div>
          )}

          {status !== "loading" && total === 0 && (
            <p className="gallery-empty">
              New photos are on their way. Please check back soon, or get in touch to see more of our work.
            </p>
          )}

          {total > 0 && (
            <div className="gallery-grid">
              {Array.from({ length: shown }, (_, i) => (
                <button key={`${tab}-${i}`} type="button" className="gcell" aria-label={`Open photo ${i + 1}: ${filtered[i].alt}`} onClick={() => openLB(i)}>
                  <Photo item={filtered[i]} sizes="(max-width: 900px) 50vw, 25vw" />
                </button>
              ))}
            </div>
          )}

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
            <span className="lb-count">{idx !== null && total > 0 ? `${idx + 1} / ${total}` : ""}</span>
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
                style={{ backgroundImage: `url("/_next/image?url=${encodeURIComponent(current.url)}&w=256&q=75")` }}
              />
            )}
            {current && idx !== null && (
              <Photo key={`${tab}-${idx}`} item={current} sizes="(max-width: 980px) 90vw, 900px" />
            )}
          </div>
          <button className="lb-nav lb-next" type="button" aria-label="Next photo" onClick={() => step(1)}>&#8250;</button>
        </div>

        <div className="lb-thumbs">
          {idx !== null &&
            filtered.map((it, k) => (
              <button
                key={`${tab}-${k}`}
                ref={(el) => { thumbRefs.current[k] = el; }}
                type="button"
                className={k === idx ? "on" : ""}
                aria-label={`Photo ${k + 1}`}
                onClick={() => setIdx(k)}
              >
                <Photo item={it} sizes="76px" />
              </button>
            ))}
        </div>
      </dialog>
    </>
  );
}
