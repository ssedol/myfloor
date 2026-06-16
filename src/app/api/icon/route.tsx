import { ImageResponse } from "next/og";
import { NextRequest } from "next/server";

const LOGO_DATA_URI = "data:image/png;base64,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";

export function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const size = Math.min(
    512,
    Math.max(16, parseInt(searchParams.get("size") ?? "192"))
  );

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
          src={LOGO_DATA_URI}
          width={logoW}
          height={logoH}
          alt="viLLiv"
        />
      </div>
    ),
    { width: size, height: size }
  );
}
