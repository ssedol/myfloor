import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

function getLogoDataUri(): string {
  const logoPath = path.join(process.cwd(), "public/logo.png");
  const data = fs.readFileSync(logoPath);
  return `data:image/png;base64,${data.toString("base64")}`;
}

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(
    512,
    Math.max(16, parseInt(searchParams.get("size") ?? "192"))
  );

  const logoDataUri = getLogoDataUri();
  const padding = size * 0.25;
  const logoW = size - padding * 2;
  const logoH = Math.round(logoW * (72 / 260));

  return new ImageResponse(
    (
      <div
        style={{
          width: size,
          height: size,
          background: "#FFFFFF",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={logoDataUri}
          width={logoW}
          height={logoH}
          alt="viLLiv"
        />
      </div>
    ),
    { width: size, height: size }
  );
}
