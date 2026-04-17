import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#0A0A0A",
          borderRadius: "14px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          fontFamily: "Georgia, serif",
        }}
      >
        <span
          style={{
            fontSize: 46,
            fontWeight: 500,
            color: "#FAFAF8",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            marginTop: -2,
          }}
        >
          P
        </span>
        <span
          style={{
            position: "absolute",
            right: 10,
            bottom: 10,
            width: 9,
            height: 9,
            borderRadius: "999px",
            background: "#F46B2C",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
