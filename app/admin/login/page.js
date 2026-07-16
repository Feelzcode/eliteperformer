"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Arc } from "@/components/ui/Loaders";
import { useToast } from "@/components/ui/Toast";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const toast = useToast();

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      if (!res.ok) throw new Error();
      router.push("/admin");
      router.refresh();
    } catch {
      toast.error("Incorrect password");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
      }}
    >
      <form
        onSubmit={handleSubmit}
        style={{
          width: "100%",
          maxWidth: 340,
          background: "var(--ink-soft)",
          border: "1px solid var(--paper-line)",
          padding: 32,
        }}
      >
        <h1 className="serif" style={{ fontSize: 22, margin: "0 0 20px" }}>
          Admin sign in
        </h1>
        <label style={{ display: "block", fontSize: 12, color: "var(--muted-dark)", marginBottom: 6 }}>
          Password
        </label>
        <input
          type="password"
          autoFocus
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: "100%",
            padding: "10px 12px",
            background: "var(--ink)",
            border: "1px solid var(--paper-line)",
            color: "var(--charcoal)",
            fontSize: 14,
            marginBottom: 18,
          }}
        />
        <button
          type="submit"
          disabled={loading}
          style={{
            width: "100%",
            padding: 13,
            background: "linear-gradient(180deg,var(--pink-light),var(--pink))",
            color: "#fff",
            border: "none",
            fontWeight: 700,
            fontSize: 13.5,
            cursor: loading ? "default" : "pointer",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
          }}
        >
          {loading ? <Arc /> : "Sign in"}
        </button>
      </form>
    </div>
  );
}
