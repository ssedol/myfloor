import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

function getFont(): Buffer {
  return fs.readFileSync(
    path.join(process.cwd(), "node_modules/pretendard/dist/public/static/Pretendard-Bold.otf")
  );
}

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(512, Math.max(16, parseInt(searchParams.get("size") ?? "192")));

  const fontData = getFont();

  return new ImageResponse(
    (
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
        <span
          style={{
            color: "#FFFFFF",
            fontSize: size * 0.32,
            fontFamily: "Pretendard",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          몇층
        </span>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [{ name: "Pretendard", data: fontData, weight: 700, style: "normal" }],
    }
  );
}
