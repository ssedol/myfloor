"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { isAdAllowedPath } from "@/lib/adPolicy";

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
  const pathname = usePathname();
  const allowed = isAdAllowedPath(pathname);

  useEffect(() => {
    if (!allowed) return;
    scheduleScriptLoad();
  }, [allowed]);

  // 콘텐츠 없는 화면(전환·완료·내부 도구)에는 광고를 붙이지 않는다.
  if (!allowed) return null;

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
