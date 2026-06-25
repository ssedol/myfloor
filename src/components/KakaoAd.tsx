"use client";

import { useEffect, useRef } from "react";

interface Props {
  unit: string;
  width: number;
  height: number;
}

export default function KakaoAd({ unit, width, height }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "//t1.kakaocdn.net/kas/static/ba.min.js";
    script.async = true;
    containerRef.current?.appendChild(script);
    return () => { script.remove(); };
  }, [unit]);

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
