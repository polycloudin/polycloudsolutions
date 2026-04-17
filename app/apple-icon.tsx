import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0A",
          borderRadius: "40px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <span
          style={{
            fontSize: 130,
            fontWeight: 500,
            color: "#FAFAF8",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            marginTop: -6,
          }}
        >
          P
        </span>
        <span
          style={{
            position: "absolute",
            right: 28,
            bottom: 28,
            width: 24,
            height: 24,
            borderRadius: "999px",
            background: "#F46B2C",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
