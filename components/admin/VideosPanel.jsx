"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { extractYouTubeId, youtubeThumbnail } from "@/lib/youtube";
import { Dots } from "@/components/ui/Loaders";
import { useToast } from "@/components/ui/Toast";

function VideoEditor({ index, caption, type, url, onChange }) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();
  const ytId = type === "youtube" ? extractYouTubeId(url) : null;
  const previewSrc = type === "youtube" ? (ytId ? youtubeThumbnail(ytId) : "") : url;

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const uploaded = await uploadToCloudinary(file, { folder: "elite-performers/videos" });
      onChange({ url: uploaded });
      toast.success(`Video ${index + 1} media uploaded`);
    } catch {
      toast.error("Upload failed — try again");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="video-edit-card">
      <div className="video-edit-top">Video {index + 1}</div>
      <div className="video-edit-body">
        <div className="video-edit-fields">
          <label className="field-label">Caption text (overlaid on the clip)</label>
          <input
            type="text"
            value={caption}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="e.g. A STRATEGY THAT WORKS"
          />

          <div className="media-toggle" style={{ marginTop: 14 }}>
            <button
              type="button"
              className={type === "youtube" ? "active" : ""}
              onClick={() => onChange({ type: "youtube" })}
            >
              YouTube
            </button>
            <button
              type="button"
              className={type === "upload" ? "active" : ""}
              onClick={() => onChange({ type: "upload" })}
            >
              Upload
            </button>
          </div>

          {type === "youtube" ? (
            <>
              <label className="field-label">YouTube video URL (unlisted is fine)</label>
              <input
                type="url"
                value={url || ""}
                onChange={(e) => onChange({ url: e.target.value })}
                placeholder="https://youtube.com/watch?v=..."
              />
              <div className="hint">Any format works — youtu.be, youtube.com/watch, or youtube.com/embed.</div>
            </>
          ) : (
            <>
              <label className="file-btn">
                {uploading ? <Dots /> : "Choose video or image file"}
                <input type="file" accept="video/*,image/*" onChange={handleFile} disabled={uploading} />
              </label>
              <div className="hint">Uploads go straight to Cloudinary.</div>
            </>
          )}
        </div>

        <div className="video-edit-preview">
          <label className="field-label">Preview</label>
          <div className="video-preview-box">
            {type === "youtube" && previewSrc && <span className="sound-tag">🔇 Enable sound</span>}
            {previewSrc && <img src={previewSrc} alt={caption} />}
            <div className="cap">{caption || "Caption text"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideosPanel({ content, setContent }) {
  function updateVideo(n, patch) {
    setContent((c) => ({
      ...c,
      [`video${n}Caption`]: patch.caption ?? c[`video${n}Caption`],
      [`video${n}Type`]: patch.type ?? c[`video${n}Type`],
      [`video${n}Url`]: patch.url ?? c[`video${n}Url`],
    }));
  }

  return (
    <div>
      <div className="panel-head">
        <div className="label">Why This Matters Section</div>
        <h1 className="serif">Homepage videos</h1>
        <p>
          The two full-width vertical video blocks under &ldquo;Here&apos;s Why This Workshop Matters&rdquo;.
          Each needs a caption and either a YouTube link or an uploaded video/image.
        </p>
      </div>

      <VideoEditor
        index={0}
        caption={content.video1Caption}
        type={content.video1Type}
        url={content.video1Url}
        onChange={(patch) => updateVideo(1, patch)}
      />
      <VideoEditor
        index={1}
        caption={content.video2Caption}
        type={content.video2Type}
        url={content.video2Url}
        onChange={(patch) => updateVideo(2, patch)}
      />
    </div>
  );
}
