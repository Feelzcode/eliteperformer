"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import "@/components/admin/admin.css";
import { Signal, Arc, Bar } from "@/components/ui/Loaders";
import { useToast } from "@/components/ui/Toast";
import DashboardPanel from "@/components/admin/DashboardPanel";
import ProfilePanel from "@/components/admin/ProfilePanel";
import VideosPanel from "@/components/admin/VideosPanel";
import TestimonialsPanel from "@/components/admin/TestimonialsPanel";

const fetcher = (url) => fetch(url).then((r) => r.json());

const PANELS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "profile", label: "Host Profile Photo" },
  { key: "videos", label: "Homepage Videos" },
  { key: "testimonials", label: "Testimonial Media" },
];

export default function AdminPage() {
  const { data, isLoading, mutate } = useSWR("/api/content", fetcher);
  const [activePanel, setActivePanel] = useState("dashboard");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState(null);
  const [testimonials, setTestimonials] = useState(null);
  const toast = useToast();
  const router = useRouter();

  // Seed local editable state once the initial fetch resolves.
  useEffect(() => {
    if (data && !content) {
      setContent(data.content);
      setTestimonials(data.testimonials);
    }
  }, [data, content]);

  function switchPanel(key) {
    setTransitioning(true);
    setActivePanel(key);
    setDrawerOpen(false);
    // Bar is cosmetic here since panels are already in memory — this models
    // where a real async panel load (e.g. a registrants table) would show it.
    setTimeout(() => setTransitioning(false), 220);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const res = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content, testimonials }),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      await mutate({ content: result.content, testimonials }, false);
      toast.success("Changes saved and live on the site");
    } catch {
      toast.error("Save failed — check your connection and try again");
    } finally {
      setSaving(false);
    }
  }

  async function handleLogout() {
    await fetch("/api/logout", { method: "POST" });
    router.push("/admin/login");
  }

  // ---- Signal: first load of the whole admin panel ----
  if (isLoading || !content || !testimonials) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Signal label="Loading content…" />
      </div>
    );
  }

  return (
    <div className="app">
      <Bar active={transitioning} />

      <div className="mobile-topbar">
        <button
          className={`hamburger ${drawerOpen ? "active" : ""}`}
          onClick={() => setDrawerOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          <span className="bar" /><span className="bar" /><span className="bar" />
        </button>
      </div>

      {drawerOpen && <div className="sidebar-backdrop show" onClick={() => setDrawerOpen(false)} />}

      <aside className={`sidebar ${drawerOpen ? "open" : ""}`}>
        <div className="brand">
          <div className="mark">E</div>
          <div className="name">Elite Performers<br />Circle · Admin</div>
        </div>
        {PANELS.map((p) => (
          <button
            key={p.key}
            className={`nav-item ${activePanel === p.key ? "active" : ""}`}
            onClick={() => switchPanel(p.key)}
          >
            <span className="dot" />
            {p.label}
          </button>
        ))}
        <button className="nav-item logout" onClick={handleLogout}>
          <span className="dot" />
          Log out
        </button>
      </aside>

      <main className="admin-main">
        {activePanel === "dashboard" && <DashboardPanel onNavigate={switchPanel} />}
        {activePanel === "profile" && <ProfilePanel content={content} setContent={setContent} />}
        {activePanel === "videos" && <VideosPanel content={content} setContent={setContent} />}
        {activePanel === "testimonials" && (
          <TestimonialsPanel testimonials={testimonials} setTestimonials={setTestimonials} />
        )}

        {activePanel !== "dashboard" && (
          <div className="save-bar">
            <button className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <Arc /> : null}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        )}
      </main>
    </div>
  );
}
