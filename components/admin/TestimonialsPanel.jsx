"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { extractYouTubeId, youtubeThumbnail } from "@/lib/youtube";
import { Dots, Skeleton } from "@/components/ui/Loaders";
import { useToast } from "@/components/ui/Toast";

let localId = -1; // negative ids for not-yet-saved rows, keeps them unique client-side

function TestimonialCard({ index, testimonial, onChange, onRemove }) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const { name, type, mediaUrl } = testimonial;
  const ytId = type === "youtube" ? extractYouTubeId(mediaUrl) : null;
  const previewSrc = type === "youtube" ? (ytId ? youtubeThumbnail(ytId) : "") : mediaUrl;

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, { folder: "elite-performers/testimonials" });
      onChange({ mediaUrl: url });
      toast.success("Screenshot uploaded");
    } catch {
      toast.error("Upload failed — try again");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="testi-card">
      <div className="testi-top">
        <span className="slot-label">Slot {index + 1}</span>
        <button className="remove-btn" onClick={onRemove}>Remove</button>
      </div>
      <div className="testi-body">
        <div className="testi-fields">
          <label className="field-label">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => onChange({ name: e.target.value })}
            placeholder="e.g. Amara"
          />

          <div className="media-toggle" style={{ marginTop: 14 }}>
            <button
              type="button"
              className={type === "image" ? "active" : ""}
              onClick={() => onChange({ type: "image" })}
            >
              Image
            </button>
            <button
              type="button"
              className={type === "youtube" ? "active" : ""}
              onClick={() => onChange({ type: "youtube" })}
            >
              YouTube
            </button>
          </div>

          {type === "image" ? (
            <>
              <label className="file-btn">
                {uploading ? <Dots /> : "Choose screenshot"}
                <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
              </label>
              <div className="hint">Tweet/post screenshots or a photo — stored on Cloudinary.</div>
            </>
          ) : (
            <>
              <label className="field-label">YouTube video URL (unlisted is fine)</label>
              <input
                type="url"
                value={mediaUrl || ""}
                onChange={(e) => onChange({ mediaUrl: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
            </>
          )}
        </div>

        <div className="testi-preview">
          <label className="field-label">Preview</label>
          <div className="preview-box">
            {previewSrc ? <img src={previewSrc} alt={name} /> : "No media yet"}
            {type === "youtube" && previewSrc && <span className="play-icon">▶</span>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function TestimonialsPanel({ testimonials, setTestimonials, loading }) {
  function update(id, patch) {
    setTestimonials((list) => list.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }
  function remove(id) {
    setTestimonials((list) => list.filter((t) => t.id !== id));
  }
  function add() {
    setTestimonials((list) => [
      ...list,
      { id: localId--, name: "", type: "image", mediaUrl: "" },
    ]);
  }

  return (
    <div>
      <div className="panel-head">
        <div className="label">Social Proof</div>
        <h1 className="serif">Testimonial media</h1>
        <p>Add a YouTube video or a screenshot for each testimonial slot. Each slot needs a name and one piece of media.</p>
      </div>

      {loading ? (
        <>
          <Skeleton rows={1} height={140} />
          <div style={{ height: 16 }} />
          <Skeleton rows={1} height={140} />
        </>
      ) : (
        <>
          {testimonials.map((t, i) => (
            <TestimonialCard
              key={t.id}
              index={i}
              testimonial={t}
              onChange={(patch) => update(t.id, patch)}
              onRemove={() => remove(t.id)}
            />
          ))}
          <button className="add-btn" onClick={add}>+ Add testimonial slot</button>
        </>
      )}
    </div>
  );
}
