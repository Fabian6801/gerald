"use client";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/Lib/supabase";

type Cat = { slug: string; title: string; hue: number };
type Item = { url: string; alt: string };
type Row = { category: string| null; image_url: string | null; title: string | null; description: string | null; };

const CATS: Cat[] = [
  { slug: "weddings-portraits", title: "Weddings & Portraits", hue: 20 },
  { slug: "travel-landscape", title: "Travel & Landscape", hue: 200 },
  { slug: "fashion-commercial", title: "Fashion & Commercial", hue: 290 },
];

// How many coloured placeholders to show for a category with no photos yet
const PLACEHOLDERS = 8;

const BLOCKS = [
  { slug: "weddings-portraits", cls: "block-left", label: "Weddings & Portraits", aria: "Open Weddings and Portraits photos" },
  { slug: "travel-landscape", cls: "block-right", label: "Travel & Landscape", aria: "Open Travel and Landscape photos" },
  { slug: "fashion-commercial", cls: "block-mid", label: "Fashion & Commercial", aria: "Open Fashion and Commercial photos" },
];

// Turns whatever is typed in the table's "category" column into one of the three gallery slugs
function toSlug(value: string | null): string | null {
  const v = (value || "").trim().toLowerCase();
  if (CATS.some((c) => c.slug === v)) return v;
  if (["wedding", "weddings", "portrait", "portraits"].includes(v)) return "weddings-portraits";
  if (["travel", "landscape", "landscapes"].includes(v)) return "travel-landscape";
  if (["fashion", "commercial", "product"].includes(v)) return "fashion-commercial";
  return null;
}

function Photo({ cat, i, item }: { cat: Cat; i: number; item?: Item }) {
  const [failedUrl, setFailedUrl] = useState<string | null>(null);
  const alt = item?.alt || `${cat.title} photo ${i + 1}`;

  // No photo yet, or the photo failed to load: show the coloured placeholder
  if (!item || failedUrl === item.url) {
    return (
      <div className="ph" style={{ "--h": cat.hue } as React.CSSProperties} role="img" aria-label={alt}>
        {cat.title} · {i + 1}
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
  const [items, setItems] = useState<Record<string, Item[]>>({});
  const [open, setOpen] = useState<{ cat: Cat; idx: number } | null>(null);

  // Load the photo list from the Supabase "portfolio" table
  useEffect(() => {
    let cancelled = false;

      async function load() {
    const { data, error } = await supabase
      .from("portfolio")
      .select("category, image_url, title, description")
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Could not load portfolio:", error.message);
      return;
    }
    if (cancelled || !data) return;

    const grouped: Record<string, Item[]> = {};
    for (const row of data as Row[]) {
      const slug = toSlug(row.category);
      if (!slug || !row.image_url) continue;
      if (!grouped[slug]) grouped[slug] = [];
      grouped[slug].push({ url: row.image_url, alt: row.title || row.description || "" });
    }
    setItems(grouped);
  }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const countOf = (cat: Cat) => items[cat.slug]?.length || PLACEHOLDERS;
  const itemAt = (cat: Cat, i: number) => items[cat.slug]?.[i];
  // For the stacks: reuse photos if a category has fewer than 3
  const stackItem = (cat: Cat, i: number) => {
    const list = items[cat.slug];
    return list?.length ? list[i % list.length] : undefined;
  };

  function openLB(cat: Cat, idx: number) {
    setOpen({ cat, idx });
    dialogRef.current?.showModal();
  }
  function step(d: number) {
    setOpen((o) => {
      if (!o) return o;
      const n = countOf(o.cat);
      return { ...o, idx: (o.idx + d + n) % n };
    });
  }

  useEffect(() => {
    if (open) thumbRefs.current[open.idx]?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [open]);

  const openCount = open ? countOf(open.cat) : 0;
  const currentItem = open ? itemAt(open.cat, open.idx) : undefined;
  return (
    <>
      <section id="work" className="section" aria-labelledby="work-h">
        <h2 id="work-h">My work</h2>
        <p className="sub">Tap a stack to open the full set from that category.</p>
        <div className="collage">
          {BLOCKS.map((b) => {
            const cat = CATS.find((c) => c.slug === b.slug)!;
            return (
              <button key={b.slug} className={`block ${b.cls}`} type="button" aria-label={b.aria} onClick={() => openLB(cat, 0)}>
                <span className="stack">
                  {[2, 1, 0].map((i) => (
                    <span className="sheet" key={i}>
                      <Photo cat={cat} i={i} item={stackItem(cat, i)} />
                    </span>
                  ))}
                </span>
                <span className="block-label"><small>View gallery</small><strong>{b.label}</strong></span>
              </button>
            );
          })}
        </div>
      </section>

      <section id="gallery" className="section" aria-labelledby="gallery-h">
        <h2 id="gallery-h">View my gallery</h2>
        <p className="sub">Click any photo to enlarge.</p>
        <div id="rails">
          {CATS.map((cat) => (
            <div className="rail" key={cat.slug}>
              <h3>{cat.title}</h3>
              <div className="marquee">
                <div className="track" style={{ animationDuration: `${countOf(cat) * 24}s` }}>
                  {[0, 1, 2, 3].map((pass) =>
                    Array.from({ length: countOf(cat) }, (_, i) => (
                      <button
                        key={`${pass}-${i}`}
                        type="button"
                        className={`thumb${pass ? " clone" : ""}`}
                        aria-label={`Open ${cat.title} photo ${i + 1}`}
                        aria-hidden={pass ? true : undefined}
                        tabIndex={pass ? -1 : undefined}
                        onClick={() => openLB(cat, i)}
                      >
                        <Photo cat={cat} i={i} item={itemAt(cat, i)} />
                      </button>
                    ))
                  )}
                </div>
              </div>
            </div>
          ))}
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
            <span className="lb-title">{open?.cat.title}</span>
            <span className="lb-count">{open ? `${open.idx + 1} / ${openCount}` : ""}</span>
          </h2>
          <button className="lb-close" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>&times;</button>
        </div>
        <div className="lb-main">
          <button className="lb-nav lb-prev" type="button" aria-label="Previous photo" onClick={() => step(-1)}>&#8249;</button>
          <div className="lb-stage">
            {currentItem && (
              <div
                className="lb-bg"
                aria-hidden="true"
                style={{ backgroundImage: `url(${JSON.stringify(currentItem.url)})` }}
              />
            )}
            {open && (
              <Photo
                key={`${open.cat.slug}-${open.idx}`}
                cat={open.cat}
                i={open.idx}
                item={currentItem}
              />
            )}
          </div>
          <button className="lb-nav lb-next" type="button" aria-label="Next photo" onClick={() => step(1)}>&#8250;</button>
        </div>
        <div className="lb-thumbs">
          {open &&
            Array.from({ length: openCount }, (_, k) => (
              <button
                key={`${open.cat.slug}-${k}`}
                ref={(el) => { thumbRefs.current[k] = el; }}
                type="button"
                className={k === open.idx ? "on" : ""}
                aria-label={`Photo ${k + 1}`}
                onClick={() => setOpen({ cat: open.cat, idx: k })}
              >
                <Photo cat={open.cat} i={k} item={itemAt(open.cat, k)} />
              </button>
            ))}
        </div>
      </dialog>
    </>
  );
}