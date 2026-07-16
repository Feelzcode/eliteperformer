"use client";

import { useEffect, useState } from "react";

const EVENT_DATE = new Date("2026-07-08T19:00:00-05:00"); // 7pm EST

function formatDiff() {
  let diff = EVENT_DATE - new Date();
  if (diff <= 0) return "Live now";
  const d = Math.floor(diff / 86400000); diff -= d * 86400000;
  const h = Math.floor(diff / 3600000); diff -= h * 3600000;
  const m = Math.floor(diff / 60000); diff -= m * 60000;
  const s = Math.floor(diff / 1000);
  return `${d}d ${String(h).padStart(2, "0")}h ${String(m).padStart(2, "0")}m ${String(s).padStart(2, "0")}s`;
}

export default function Ticker() {
  const [time, setTime] = useState("--:--:--:--");

  useEffect(() => {
    setTime(formatDiff());
    const id = setInterval(() => setTime(formatDiff()), 1000);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="ticker">
      Workshop starts in <b>{time}</b>
    </div>
  );
}
