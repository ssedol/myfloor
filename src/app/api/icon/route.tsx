import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(
    512,
    Math.max(16, parseInt(searchParams.get("size") ?? "192"))
  );

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "#8FAF8B",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: size * 0.2,
        }}
      >
        <div
          style={{
            color: "white",
            fontSize: size * 0.42,
            fontWeight: 700,
            lineHeight: 1,
            letterSpacing: "-0.02em",
          }}
        >
          P
        </div>
      </div>
    ),
    { width: size, height: size }
  );
}
