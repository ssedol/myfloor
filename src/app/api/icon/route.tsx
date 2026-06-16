import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(512, Math.max(16, parseInt(searchParams.get("size") ?? "192")));

  return new ImageResponse(
    <div
      style={{
        width: size,
        height: size,
        background: "#40342E",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div style={{ color: "#9BC72E", fontSize: size * 0.3, fontWeight: "bold" }}>P</div>
    </div>,
    { width: size, height: size }
  );
}
