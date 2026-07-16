"use client";

import { useState } from "react";
import { uploadToCloudinary } from "@/lib/uploadToCloudinary";
import { Dots } from "@/components/ui/Loaders";
import { useToast } from "@/components/ui/Toast";

export default function ProfilePanel({ content, setContent }) {
  const [uploading, setUploading] = useState(false);
  const toast = useToast();

  async function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const url = await uploadToCloudinary(file, { folder: "elite-performers/profile" });
      setContent((c) => ({ ...c, profilePhoto: url }));
      toast.success("Photo uploaded");
    } catch {
      toast.error("Upload failed — try again");
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <div className="panel-head">
        <div className="label">Host Profile</div>
        <h1 className="serif">Profile photo</h1>
        <p>This is the circular photo shown next to the host bio on the landing page.</p>
      </div>

      <div className="card">
        <h3>Upload photo</h3>
        <p className="sub">Recommended: a square image, at least 300×300px. Stored on Cloudinary.</p>
        <div className="photo-row">
          <div className="photo-preview">
            {uploading ? (
              <Dots />
            ) : content.profilePhoto ? (
              <img src={content.profilePhoto} alt="Host" />
            ) : (
              "No photo"
            )}
          </div>
          <div className="photo-actions">
            <label className="file-btn">
              Choose image
              <input type="file" accept="image/*" onChange={handleFile} disabled={uploading} />
            </label>
            <div className="hint">Uploads go straight to Cloudinary — nothing passes through our server.</div>
          </div>
        </div>
      </div>
    </div>
  );
}
