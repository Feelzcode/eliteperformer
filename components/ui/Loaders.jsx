"use client";

/**
 * Five loaders, five distinct jobs. Don't mix them up — using the wrong one
 * is a small thing that quietly makes the UI feel inconsistent.
 *
 *   Signal   → first load of a whole page/panel (nothing on screen yet)
 *   Arc      → inside a button while an action is in flight (Save, Submit, Upload)
 *   Dots     → passive waiting for something with no defined end (e.g. "processing…")
 *   Bar      → route/panel transitions (top-of-viewport progress line)
 *   Skeleton → tables / lists / cards that are about to be replaced by real content
 */

/* ---------------- Signal — first load ---------------- */
// A soft pulsing ring, centered, for the very first paint of a page or panel
// before any data exists yet. Use full-bleed inside the container being loaded.
export function Signal({ label = "Loading…" }) {
  return (
    <div className="ld-signal-wrap" role="status" aria-live="polite">
      <span className="ld-signal">
        <span className="ld-signal-core" />
        <span className="ld-signal-ring" />
        <span className="ld-signal-ring ld-signal-ring2" />
      </span>
      {label && <p className="ld-signal-label">{label}</p>}
    </div>
  );
}

/* ---------------- Arc — button actions ---------------- */
// A small spinning arc that replaces (or sits beside) button text while a
// click-triggered action — save, submit, delete, upload — is in flight.
// Usage: <button disabled={saving}>{saving ? <Arc /> : "Save"}</button>
export function Arc({ size = 16 }) {
  return (
    <span
      className="ld-arc"
      style={{ width: size, height: size }}
      role="status"
      aria-label="Working"
    />
  );
}

/* ---------------- Dots — passive wait ---------------- */
// Three bouncing dots for open-ended waiting with no progress signal —
// e.g. "waiting on webhook", "processing upload server-side".
export function Dots({ label }) {
  return (
    <span className="ld-dots-wrap" role="status" aria-live="polite">
      <span className="ld-dots">
        <span /><span /><span />
      </span>
      {label && <span className="ld-dots-label">{label}</span>}
    </span>
  );
}

/* ---------------- Bar — transitions ---------------- */
// A thin progress bar pinned to the top of its container, for panel/route
// transitions (e.g. switching admin sidebar tabs, client-side navigation).
// Mount it conditionally at the top of the page/layout while `active` is true.
export function Bar({ active }) {
  if (!active) return null;
  return <span className="ld-bar" aria-hidden="true" />;
}

/* ---------------- Skeleton — tables/lists ---------------- */
// Gray placeholder blocks matching the shape of the real content. Compose
// with `rows`/`height` for tables and lists (testimonial list, registrant
// table, etc.) so layout doesn't jump when real data arrives.
export function Skeleton({ rows = 3, height = 20, gap = 10, width = "100%" }) {
  return (
    <div className="ld-skel-wrap" style={{ gap }} aria-hidden="true">
      {Array.from({ length: rows }).map((_, i) => (
        <span key={i} className="ld-skel" style={{ height, width }} />
      ))}
    </div>
  );
}

export function SkeletonCard({ height = 180 }) {
  return <span className="ld-skel ld-skel-card" style={{ height }} aria-hidden="true" />;
}
