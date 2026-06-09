import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

function getFont(): Buffer {
  const fontPath = path.join(
    process.cwd(),
    "node_modules/pretendard/dist/public/static/Pretendard-Bold.otf"
  );
  return fs.readFileSync(fontPath);
}

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(
    512,
    Math.max(16, parseInt(searchParams.get("size") ?? "192"))
  );

  const fontData = getFont();
  const r = size * 0.2;
  const textSize = size * 0.36;

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "linear-gradient(145deg, #9BBF97 0%, #6B9166 100%)",
          borderRadius: r,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          gap: 0,
        }}
      >
        <div
          style={{
            color: "rgba(255,255,255,0.75)",
            fontSize: textSize * 0.42,
            fontFamily: "Pretendard",
            fontWeight: 700,
            lineHeight: 1,
            marginBottom: size * 0.02,
          }}
        >
          몇
        </div>
        <div
          style={{
            color: "white",
            fontSize: textSize,
            fontFamily: "Pretendard",
            fontWeight: 700,
            lineHeight: 1,
          }}
        >
          층
        </div>
      </div>
    ),
    {
      width: size,
      height: size,
      fonts: [
        {
          name: "Pretendard",
          data: fontData,
          weight: 700,
          style: "normal",
        },
      ],
    }
  );
}
