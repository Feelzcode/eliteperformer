"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { extractYouTubeId, youtubeThumbnail } from "@/lib/youtube";
import { Dots } from "@/components/ui/Loaders";
import { useToast } from "@/components/ui/Toast";

function VideoEditor({ title, hint, caption, type, url, onChange, successLabel }) {
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
      toast.success(successLabel || "Media uploaded");
    } catch {
      toast.error("Upload failed — try again");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className="video-edit-card">
      <div className="video-edit-top">{title}</div>
      <div className="video-edit-body">
        <div className="video-edit-fields">
          {hint ? <p className="hint" style={{ marginTop: 0 }}>{hint}</p> : null}

          <label className="field-label">Caption text (overlaid on the clip)</label>
          <input
            type="text"
            value={caption || ""}
            onChange={(e) => onChange({ caption: e.target.value })}
            placeholder="e.g. WATCH THIS NEXT"
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
            {previewSrc && <img src={previewSrc} alt={caption || "Preview"} />}
            <div className="cap">{caption || "Caption text"}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VideosPanel({ content, setContent }) {
  function patchFields(fields) {
    setContent((c) => ({ ...c, ...fields }));
  }

  return (
    <div>
      <div className="panel-head">
        <div className="label">Videos</div>
        <h1 className="serif">Homepage &amp; thank-you videos</h1>
        <p>
          Homepage uses one live VSL. The thank-you page uses a second video above the pre-intake
          form (after someone registers from the homepage — like a Calvin Tran-style next step).
        </p>
      </div>

      <VideoEditor
        title="Homepage video"
        hint="Shown under “Here’s Why This Workshop Matters” on the landing page."
        caption={content.video1Caption}
        type={content.video1Type || "youtube"}
        url={content.video1Url}
        successLabel="Homepage video uploaded"
        onChange={(patch) =>
          patchFields({
            ...(patch.caption !== undefined ? { video1Caption: patch.caption } : {}),
            ...(patch.type !== undefined ? { video1Type: patch.type } : {}),
            ...(patch.url !== undefined ? { video1Url: patch.url } : {}),
          })
        }
      />

      <VideoEditor
        title="Thank-you page video"
        hint="Plays on /thank-you above the pre-intake form. This is the second registration step after homepage signup."
        caption={content.thankYouVideoCaption}
        type={content.thankYouVideoType || "youtube"}
        url={content.thankYouVideoUrl}
        successLabel="Thank-you video uploaded"
        onChange={(patch) =>
          patchFields({
            ...(patch.caption !== undefined ? { thankYouVideoCaption: patch.caption } : {}),
            ...(patch.type !== undefined ? { thankYouVideoType: patch.type } : {}),
            ...(patch.url !== undefined ? { thankYouVideoUrl: patch.url } : {}),
          })
        }
      />

      <details style={{ marginTop: 24, opacity: 0.85 }}>
        <summary style={{ cursor: "pointer", fontWeight: 600 }}>
          Optional: homepage video 2 (hidden on site for now)
        </summary>
        <p className="hint" style={{ marginTop: 10 }}>
          Kept for a future second homepage block. Not shown on the live homepage until that section
          is re-enabled in code.
        </p>
        <VideoEditor
          title="Homepage video 2 (optional / hidden)"
          caption={content.video2Caption}
          type={content.video2Type || "youtube"}
          url={content.video2Url}
          successLabel="Homepage video 2 uploaded"
          onChange={(patch) =>
            patchFields({
              ...(patch.caption !== undefined ? { video2Caption: patch.caption } : {}),
              ...(patch.type !== undefined ? { video2Type: patch.type } : {}),
              ...(patch.url !== undefined ? { video2Url: patch.url } : {}),
            })
          }
        />
      </details>
    </div>
  );
}
