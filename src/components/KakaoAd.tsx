"use client";

import { useEffect, useRef } from "react";

interface Props {
  unit: string;
  width: number;
  height: number;
}

let loadTimer: ReturnType<typeof setTimeout> | null = null;

function scheduleScriptLoad() {
  if (loadTimer) clearTimeout(loadTimer);
  loadTimer = setTimeout(() => {
    loadTimer = null;
    const existing = document.querySelector("script[data-kakao-ad]");
    if (existing) existing.remove();
    const script = document.createElement("script");
    script.src = "//t1.kakaocdn.net/kas/static/ba.min.js";
    script.async = true;
    script.setAttribute("data-kakao-ad", "true");
    document.body.appendChild(script);
  }, 0);
}

export default function KakaoAd({ unit, width, height }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scheduleScriptLoad();
  }, []);

  return (
    <div ref={containerRef} className="w-full">
      <ins
        className="kakao_ad_area"
        style={{ display: "none", width: "100%" }}
        data-ad-unit={unit}
        data-ad-width={String(width)}
        data-ad-height={String(height)}
      />
    </div>
  );
}
