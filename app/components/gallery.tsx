"use client";
import { useEffect, useRef, useState } from "react";

const CATS = [
  { slug: "weddings-portraits", title: "Weddings & Portraits", count: 8, hue: 20 },
  { slug: "travel-landscape", title: "Travel & Landscape", count: 8, hue: 200 },
  { slug: "fashion-commercial", title: "Fashion & Commercial", count: 8, hue: 290 },
];
type Cat = (typeof CATS)[number];

const BLOCKS = [
  { slug: "weddings-portraits", cls: "block-left", label: "Weddings & Portraits", aria: "Open Weddings and Portraits photos" },
  { slug: "travel-landscape", cls: "block-right", label: "Travel & Landscape", aria: "Open Travel and Landscape photos" },
  { slug: "fashion-commercial", cls: "block-mid", label: "Fashion & Commercial", aria: "Open Fashion and Commercial photos" },
];

function Photo({ cat, i }: { cat: Cat; i: number }) {
  const [failed, setFailed] = useState(false);
  const alt = `${cat.title} photo ${i + 1}`;

  if (failed) {
    return (
      <div className="ph" style={{ "--h": cat.hue } as React.CSSProperties} role="img" aria-label={alt}>
        {cat.title} · {i + 1}
      </div>
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${cat.slug}/${i + 1}.jpg`}
      alt={alt}
      decoding="async"
      ref={(el) => {
        if (el && el.complete && el.naturalWidth === 0) setFailed(true);
      }}
      onError={() => setFailed(true)}
    />
  );
}

export default function Gallery() {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const thumbRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [open, setOpen] = useState<{ cat: Cat; idx: number } | null>(null);

  function openLB(cat: Cat, idx: number) {
    setOpen({ cat, idx });
    dialogRef.current?.showModal();
  }
  function step(d: number) {
    setOpen((o) => (o ? { ...o, idx: (o.idx + d + o.cat.count) % o.cat.count } : o));
  }

  useEffect(() => {
    if (open) thumbRefs.current[open.idx]?.scrollIntoView({ block: "nearest", inline: "center" });
  }, [open]);

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
                    <span className="sheet" key={i}><Photo cat={cat} i={i} /></span>
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
                <div className="track" style={{ animationDuration: `${cat.count * 24}s` }}>
                  {[0, 1].map((pass) =>
                    Array.from({ length: cat.count }, (_, i) => (
                      <button
                        key={`${pass}-${i}`}
                        type="button"
                        className={`thumb${pass ? " clone" : ""}`}
                        aria-label={`Open ${cat.title} photo ${i + 1}`}
                        aria-hidden={pass ? true : undefined}
                        tabIndex={pass ? -1 : undefined}
                        onClick={() => openLB(cat, i)}
                      >
                        <Photo cat={cat} i={i} />
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
            <span className="lb-count">{open ? `${open.idx + 1} / ${open.cat.count}` : ""}</span>
          </h2>
          <button className="lb-close" type="button" aria-label="Close" onClick={() => dialogRef.current?.close()}>&times;</button>
        </div>
        <div className="lb-main">
          <button className="lb-nav lb-prev" type="button" aria-label="Previous photo" onClick={() => step(-1)}>&#8249;</button>
          <div className="lb-stage">
            {open && <Photo key={`${open.cat.slug}-${open.idx}`} cat={open.cat} i={open.idx} />}
          </div>
          <button className="lb-nav lb-next" type="button" aria-label="Next photo" onClick={() => step(1)}>&#8250;</button>
        </div>
        <div className="lb-thumbs">
          {open &&
            Array.from({ length: open.cat.count }, (_, k) => (
              <button
                key={`${open.cat.slug}-${k}`}
                ref={(el) => { thumbRefs.current[k] = el; }}
                type="button"
                className={k === open.idx ? "on" : ""}
                aria-label={`Photo ${k + 1}`}
                onClick={() => setOpen({ cat: open.cat, idx: k })}
              >
                <Photo cat={open.cat} i={k} />
              </button>
            ))}
        </div>
      </dialog>
    </>
  );
} 