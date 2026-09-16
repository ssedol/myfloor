"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { isAdAllowedPath } from "@/lib/adPolicy";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

import { AD_CLIENT, AD_SLOT } from "@/config/adsense";

export default function AdBanner() {
  const pathname = usePathname();
  const allowed = isAdAllowedPath(pathname);

  useEffect(() => {
    if (!allowed) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, [allowed]);

  // 콘텐츠 없는 화면에는 광고를 붙이지 않는다. 승인 후 이 컴포넌트를 쓸 때도
  // 반드시 본문 아래에 배치할 것.
  if (!allowed) return null;

  return (
    <ins
      className="adsbygoogle block"
      style={{ display: "block" }}
      data-ad-client={AD_CLIENT}
      data-ad-slot={AD_SLOT}
      data-ad-format="auto"
      data-full-width-responsive="true"
    />
  );
}
