"use client";

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url).then((r) => {
  if (!r.ok) throw new Error("Failed to load dashboard");
  return r.json();
});

function formatRelativeTime(iso) {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

const HEALTH_ITEMS = [
  { key: "profilePhoto", label: "Host profile photo", panel: "profile" },
  { key: "video1", label: "Homepage video", panel: "videos" },
  { key: "thankYouVideo", label: "Thank-you page video", panel: "videos" },
  { key: "testimonials", label: "At least one testimonial", panel: "testimonials" },
];

export default function DashboardPanel({ onNavigate }) {
  const { data, isLoading, error, mutate } = useSWR("/api/admin/dashboard", fetcher);
  const [resyncingId, setResyncingId] = useState(null);
  const [resyncMsg, setResyncMsg] = useState(null);

  async function resyncToEngageFoyer(id) {
    setResyncMsg(null);
    setResyncingId(id);
    try {
      const res = await fetch("/api/admin/pre-intake/resync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const payload = await res.json().catch(() => ({}));
      if (!res.ok) {
        setResyncMsg({ ok: false, text: payload.error || "Sync failed" });
        return;
      }
      setResyncMsg({
        ok: true,
        text: `Synced ${payload.email} as ${String(payload.leadTier || "").toUpperCase()}`,
      });
      mutate();
    } catch {
      setResyncMsg({ ok: false, text: "Network error — try again" });
    } finally {
      setResyncingId(null);
    }
  }

  if (isLoading) {
    return (
      <div className="panel-head">
        <div className="label">Overview</div>
        <h1 className="serif">Dashboard</h1>
        <p>Loading…</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="panel-head">
        <div className="label">Overview</div>
        <h1 className="serif">Dashboard</h1>
        <p>Could not load dashboard data.</p>
      </div>
    );
  }

  const { stats, contentHealth, recentPreIntake, engagefoyer } = data;
  const efSignups = engagefoyer.connected && stats.engagefoyerSignups != null
    ? stats.engagefoyerSignups
    : "—";

  return (
    <>
      <div className="panel-head">
        <div className="label">Overview</div>
        <h1 className="serif">Dashboard</h1>
        <p>Site content health, pre-intake activity, and a quick link to EngageFoyer for webinar signups.</p>
      </div>

      <div className="stats-row">
        <div className="stat-card">
          <div className="k">Workshop signups</div>
          <div className="v">{efSignups}</div>
          <p className="stat-note">Via EngageFoyer {engagefoyer.connected ? "" : "(not connected yet)"}</p>
        </div>
        <div className="stat-card">
          <div className="k">Pre-intake completed</div>
          <div className="v">{stats.preIntakeCount}</div>
          <p className="stat-note">Thank-you form on this site</p>
        </div>
        <div className="stat-card">
          <div className="k">Testimonials live</div>
          <div className="v">{stats.testimonialCount}</div>
        </div>
      </div>

      {engagefoyer.dashboardUrl ? (
        <div className="card ef-link-card">
          <h3>Webinar funnel</h3>
          <p className="sub">
            Registrants, join clicks, and attendance live in EngageFoyer — not duplicated here.
          </p>
          <a
            href={engagefoyer.dashboardUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="ef-link-btn"
          >
            Open webinar dashboard in EngageFoyer →
          </a>
        </div>
      ) : (
        <div className="card ef-link-card">
          <h3>Webinar funnel</h3>
          <p className="sub">
            Set <code>ENGAGEFOYER_APP_URL</code> and <code>ENGAGEFOYER_API_KEY</code> in your env to
            enable registration and the dashboard link. Generate the API key in EngageFoyer Settings.
          </p>
        </div>
      )}

      <div className="card">
        <h3>Content health</h3>
        <p className="sub">Quick check on whether the homepage is fully set up.</p>
        {HEALTH_ITEMS.map((item) => {
          const ok = contentHealth[item.key];
          return (
            <div className="health-row" key={item.key}>
              <div className="health-left">
                <span className={`health-dot ${ok ? "ok" : "bad"}`} />
                <span className="health-label">{item.label}</span>
              </div>
              {!ok && (
                <button type="button" className="setup-link" onClick={() => onNavigate(item.panel)}>
                  Set it up →
                </button>
              )}
            </div>
          );
        })}
      </div>

      <div className="activity-row">
        <div className="activity-card">
          <h3>Recent pre-intake submissions</h3>
          <p className="sub">
            Thank-you form answers (Elite). Auto-syncs to EngageFoyer Contacts; use{" "}
            <strong>Sync</strong> if that call failed.
          </p>
          {resyncMsg ? (
            <p
              className="sub"
              style={{
                marginTop: 8,
                color: resyncMsg.ok ? "var(--pink-light)" : "var(--danger)",
              }}
            >
              {resyncMsg.text}
            </p>
          ) : null}
          <div className="activity-list">
            {recentPreIntake.length === 0 ? (
              <p className="activity-empty">No pre-intake submissions yet.</p>
            ) : (
              recentPreIntake.map((row) => (
                <div className="activity-item" key={row.id}>
                  <div>
                    <div className="activity-name">
                      {row.name}
                      {row.leadTier ? (
                        <span
                          style={{
                            marginLeft: 8,
                            fontSize: 10,
                            fontWeight: 700,
                            letterSpacing: "0.04em",
                            textTransform: "uppercase",
                            color:
                              row.leadTier === "hot"
                                ? "#c45c26"
                                : row.leadTier === "warm"
                                  ? "#b8860b"
                                  : "var(--muted)",
                          }}
                        >
                          {row.leadTier}
                        </span>
                      ) : null}
                    </div>
                    <div className="activity-email">{row.email}</div>
                  </div>
                  <div className="activity-actions">
                    <button
                      type="button"
                      className="resync-btn"
                      disabled={!engagefoyer.connected || resyncingId === row.id}
                      title={
                        engagefoyer.connected
                          ? "Push lead tier to EngageFoyer Contacts"
                          : "Configure ENGAGEFOYER_APP_URL and ENGAGEFOYER_API_KEY first"
                      }
                      onClick={() => resyncToEngageFoyer(row.id)}
                    >
                      {resyncingId === row.id ? "Syncing…" : "Sync"}
                    </button>
                    <span className="activity-time">{formatRelativeTime(row.createdAt)}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
