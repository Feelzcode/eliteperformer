import { ImageResponse } from "next/og";
import { DEFAULT_OG_IMAGE_ALT } from "@/lib/site-seo";

export const runtime = "edge";
export const alt = DEFAULT_OG_IMAGE_ALT;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Default Open Graph / link-preview image (1200×630). */
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 72,
          background: "linear-gradient(145deg, #0A0A0D 0%, #16151B 55%, #2A1038 100%)",
          color: "#F5F3F1",
          fontFamily: "Georgia, 'Times New Roman', serif",
        }}
      >
        <div
          style={{
            fontSize: 18,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: "#C9A0E8",
            marginBottom: 28,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Free live workshop
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            lineHeight: 1.12,
            maxWidth: 980,
            letterSpacing: "-0.02em",
          }}
        >
          Elite Performers Circle
        </div>
        <div
          style={{
            marginTop: 22,
            fontSize: 28,
            color: "rgba(245,243,241,0.72)",
            maxWidth: 900,
            lineHeight: 1.35,
            fontFamily: "system-ui, sans-serif",
          }}
        >
          Build a $10K–$20K/month Airbnb business — without owning property.
        </div>
      </div>
    ),
    { ...size },
  );
}
