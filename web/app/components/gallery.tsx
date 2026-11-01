"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "@/Lib/supabase";
import { useOnline } from "@/app/lib/useOnline";

type Item = { url: string; alt: string; title: string; group: string };
type Row = {
  image_url: string | null;
  title: string | null;
  description: string | null;
  category: string | null;
};
type Status = "loading" | "ready" | "error";

const FIRST = 8; // photos shown before the "Show all" button
const LITE = 4; // photos shown in lite mode
const CACHE_KEY = "gallery-cache-v1";
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

// Mixes the categories: one photo from each category in turn (newest first inside each one),
// so the "All" view is never filled by a single group
function interleave(list: Item[], groups: string[]): Item[] {
  const buckets = groups.map((g) => list.filter((i) => i.group === g));
  const longest = Math.max(0, ...buckets.map((b) => b.length));
  const out: Item[] = [];
  for (let n = 0; n < longest; n++) {
    for (const bucket of buckets) {
      if (bucket[n]) out.push(bucket[n]);
    }
  }
  return out;
}

// The last list of photos that loaded successfully, kept on the visitor's device
function readCache(): Item[] {
  try {
    const raw = localStorage.getItem(CACHE_KEY);
    const parsed = raw ? (JSON.parse(raw) as Item[]) : [];
    return Array.isArray(parsed) ? parsed.filter((i) => i && typeof i.url === "string") : [];
  } catch {
    return [];
  }
}

function Photo({ item, sizes, onDone }: { item: Item; sizes: string; onDone: (url: string) => void }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <div className="ph" role="img" aria-label={item.alt}>
        Photo unavailable
      </div>
    );
  }
  return (
    <Image
      src={item.url}
      alt={item.alt}
      fill
      sizes={sizes}
      onLoad={() => onDone(item.url)}
      onError={() => {
        setFailed(true);
        onDone(item.url);
      }}
    />
  );
}

export default function Gallery() {
  const online = useOnline();
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [fromCache, setFromCache] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const [tab, setTab] = useState("All");
  const [showAll, setShowAll] = useState(false);
  const [lite, setLite] = useState(false);
  const [slow, setSlow] = useState(false);
  const [loaded, setLoaded] = useState<Set<string>>(() => new Set());
  const [idx, setIdx] = useState<number | null>(null);

  const markLoaded = useCallback((url: string) => {
    setLoaded((prev) => (prev.has(url) ? prev : new Set(prev).add(url)));
  }, []);

  // Load the photo list from the Supabase "portfolio" table, newest first
  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const { data, error } = await supabase
          .from("portfolio")
          .select("image_url, title, description, category")
          .order("created_at", { ascending: false });
        if (cancelled) return;
        if (error || !data) throw new Error(error?.message || "No data");

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
        setFromCache(false);
        setStatus("ready");
        try { localStorage.setItem(CACHE_KEY, JSON.stringify(list)); } catch {}
      } catch (err) {
        if (cancelled) return;
        console.error("Could not load portfolio:", err);
        // Keep something on screen: the photos from the last visit
        const cached = readCache();
        if (cached.length > 0) {
          setItems(cached);
          setFromCache(true);
          setStatus("ready");
        } else {
          setStatus("error");
        }
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [attempt]);

  // When the connection comes back, refresh automatically
  useEffect(() => {
    if (online && (status === "error" || fromCache)) setAttempt((a) => a + 1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  // A slow connection or "data saver" setting offers lite mode straight away
  useEffect(() => {
    const conn = (navigator as Navigator & { connection?: { effectiveType?: string; saveData?: boolean } }).connection;
    if (conn?.saveData || (conn?.effectiveType && /2g|3g/.test(conn.effectiveType))) setSlow(true);
  }, []);

  const groups = useMemo(() => {
    const present = Array.from(new Set(items.map((i) => i.group)));
    const known = ORDER.filter((g) => present.includes(g));
    const other = present.filter((g) => !ORDER.includes(g)).sort();
    return [...known, ...other];
  }, [items]);

  const mixed = useMemo(() => interleave(items, groups), [items, groups]);
  const filtered = tab === "All" ? mixed : items.filter((i) => i.group === tab);
  const total = filtered.length;
  const shown = showAll ? total : Math.min(lite ? LITE : FIRST, total);
  const visible = filtered.slice(0, shown);
  const doneCount = visible.filter((i) => loaded.has(i.url)).length;
  const pending = shown - doneCount;
  const current = idx !== null ? filtered[idx] : undefined;

  // Photos still loading after 4 seconds: offer the lighter version
  useEffect(() => {
    if (status !== "ready" || pending === 0) return;
    const timer = setTimeout(() => setSlow(true), 4000);
    return () => clearTimeout(timer);
  }, [status, pending]);

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

          {/* Offline or server trouble: keep the last photos on screen and say what is happening */}
          {fromCache && (
            <div className="notice notice-warn" role="status">
              <i className="fa-solid fa-wifi" aria-hidden="true"></i>
              <span>
                {online
                  ? "We could not refresh the gallery just now. These are the photos from your last visit."
                  : "You are offline. These are the photos from your last visit."}
              </span>
              <button type="button" className="link-inline" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
            </div>
          )}

          {groups.length > 1 && (
            <div className="gallery-tabs" role="group" aria-label="Filter photos by category">
              {["All", ...groups].map((g) => (
                <button key={g} type="button" className="tab" aria-pressed={tab === g} onClick={() => chooseTab(g)}>
                  {g}
                </button>
              ))}
            </div>
          )}

          {/* LOADING: show the shape of what is coming, not a spinner */}
          {status === "loading" && (
            <div className="gallery-grid" aria-hidden="true">
              {Array.from({ length: FIRST }, (_, i) => (
                <div key={i} className="gcell skeleton" />
              ))}
            </div>
          )}

          {/* ERROR: what went wrong, whose fault, how to fix it */}
          {status === "error" && (
            <div className="state-box" role="alert">
              <i className="fa-regular fa-circle-xmark" aria-hidden="true"></i>
              <h3>We could not load the photos</h3>
              <p>
                {online
                  ? "This is a problem on our side, not yours. Please try again in a moment, or message us and we will send you examples."
                  : "Your device seems to be offline. Check your internet connection, then try again."}
              </p>
              <p className="state-actions">
                <button type="button" className="btn-green" onClick={() => setAttempt((a) => a + 1)}>Try again</button>
                <Link className="btn-outline-dark" href="/book">Book a session</Link>
              </p>
            </div>
          )}

          {/* EMPTY: say why it is empty, then give one next step */}
          {status === "ready" && total === 0 && (
            <div className="state-box">
              <i className="fa-regular fa-images" aria-hidden="true"></i>
              <h3>New photos are on their way</h3>
              <p>
                We are adding our latest work to the gallery. Tell us about your day and we will share examples that
                match it.
              </p>
              <p className="state-actions">
                <Link className="btn-green" href="/book">Book a session</Link>
              </p>
            </div>
          )}

          {/* SLOW NETWORK: real progress and a lighter path */}
          {status === "ready" && total > 0 && pending > 0 && (
            <div className="progress-note" role="status">
              <div className="progress" role="progressbar" aria-valuemin={0} aria-valuemax={shown} aria-valuenow={doneCount} aria-label="Loading photos">
                <span style={{ width: `${shown ? (doneCount / shown) * 100 : 0}%` }} />
              </div>
              <p>Loading photos &middot; {doneCount} of {shown}</p>
            </div>
          )}
          {total > 0 && slow && !lite && (
            <div className="notice" role="status">
              <i className="fa-solid fa-gauge" aria-hidden="true"></i>
              <span>Slow connection? Lite mode loads fewer photos so the page opens faster.</span>
              <button type="button" className="link-inline" onClick={() => setLite(true)}>Switch to lite mode</button>
            </div>
          )}
          {total > 0 && lite && (
            <div className="notice" role="status">
              <i className="fa-solid fa-gauge" aria-hidden="true"></i>
              <span>Lite mode is on.</span>
              <button type="button" className="link-inline" onClick={() => setLite(false)}>Show the full gallery</button>
            </div>
          )}

          {total > 0 && (
            <div className="gallery-grid">
              {visible.map((it, i) => (
                <button
                  key={`${tab}-${i}`}
                  type="button"
                  className={`gcell${loaded.has(it.url) ? "" : " is-loading"}`}
                  aria-label={`Open photo ${i + 1}: ${it.alt}`}
                  onClick={() => openLB(i)}
                >
                  <Photo item={it} sizes="(max-width: 900px) 50vw, 25vw" onDone={markLoaded} />
                </button>
              ))}
            </div>
          )}

          {total > shown || showAll ? (
            <div className="gallery-more">
              <button type="button" className="btn-outline-dark" onClick={() => setShowAll((v) => !v)}>
                {showAll ? "Show fewer photos" : `Show all ${total} photos`}
              </button>
            </div>
          ) : null}
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
            {current && !lite && (
              <div
                className="lb-bg"
                aria-hidden="true"
                style={{ backgroundImage: `url("/_next/image?url=${encodeURIComponent(current.url)}&w=256&q=75")` }}
              />
            )}
            {current && idx !== null && (
              <Photo key={`${tab}-${idx}`} item={current} sizes="(max-width: 980px) 90vw, 900px" onDone={markLoaded} />
            )}
          </div>
          <button className="lb-nav lb-next" type="button" aria-label="Next photo" onClick={() => step(1)}>&#8250;</button>
        </div>

        {!lite && (
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
                  <Photo item={it} sizes="76px" onDone={markLoaded} />
                </button>
              ))}
          </div>
        )}
      </dialog>
    </>
  );
}
