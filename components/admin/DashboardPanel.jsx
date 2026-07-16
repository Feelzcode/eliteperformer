"use client";

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
  { key: "video1", label: "Homepage video 1", panel: "videos" },
  { key: "video2", label: "Homepage video 2", panel: "videos" },
  { key: "testimonials", label: "At least one testimonial", panel: "testimonials" },
];

export default function DashboardPanel({ onNavigate }) {
  const { data, isLoading, error } = useSWR("/api/admin/dashboard", fetcher);

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
            Set <code>ENGAGEFOYER_APP_URL</code> and <code>ENGAGEFOYER_WEBINAR_ID</code> in your env to
            enable the link. Signup counts will sync after integration.
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
          <p className="sub">Collected on the thank-you page (Elite only).</p>
          <div className="activity-list">
            {recentPreIntake.length === 0 ? (
              <p className="activity-empty">No pre-intake submissions yet.</p>
            ) : (
              recentPreIntake.map((row) => (
                <div className="activity-item" key={row.id}>
                  <div>
                    <div className="activity-name">{row.name}</div>
                    <div className="activity-email">{row.email}</div>
                  </div>
                  <span className="activity-time">{formatRelativeTime(row.createdAt)}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
}
