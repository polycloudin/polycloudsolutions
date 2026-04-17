import { ImageResponse } from "next/og";

export const alt = "PolyCloud — Your business, on autopilot.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "linear-gradient(135deg, #FAFAF8 0%, #F3F0E8 100%)",
          fontFamily: "Georgia, serif",
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              "radial-gradient(ellipse 60% 50% at 10% 0%, rgba(26, 95, 212, 0.08) 0%, transparent 60%), radial-gradient(ellipse 40% 40% at 90% 100%, rgba(244, 107, 44, 0.06) 0%, transparent 55%)",
          }}
        />

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "28px",
            fontWeight: 600,
            color: "#0A0A0A",
            letterSpacing: "-0.02em",
          }}
        >
          <span>Polycloud</span>
          <span style={{ color: "#F46B2C" }}>.</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "40px" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "14px",
              fontSize: "16px",
              letterSpacing: "0.22em",
              textTransform: "uppercase",
              color: "#6B7280",
              fontFamily: "monospace",
            }}
          >
            <div
              style={{
                width: "8px",
                height: "8px",
                borderRadius: "999px",
                background: "#F46B2C",
              }}
            />
            <span>Automation Infrastructure · Since 2020</span>
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              fontSize: "140px",
              fontWeight: 500,
              lineHeight: 0.92,
              letterSpacing: "-0.035em",
              color: "#0A0A0A",
            }}
          >
            <span>Your business,</span>
            <span style={{ color: "#1A5FD4", fontStyle: "italic" }}>
              on autopilot.
            </span>
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-end",
            fontSize: "22px",
            color: "#6B7280",
          }}
        >
          <span style={{ maxWidth: "620px", lineHeight: 1.4 }}>
            Automation for modern operators. Digital services + AI consulting.
          </span>
          <span
            style={{
              fontFamily: "monospace",
              fontSize: "15px",
              letterSpacing: "0.18em",
              textTransform: "uppercase",
            }}
          >
            polycloud.in
          </span>
        </div>
      </div>
    ),
    size
  );
}
