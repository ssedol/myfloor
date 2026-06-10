"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

export const AD_CLIENT = "ca-pub-4773298245322018";
export const AD_SLOT = "2167430117";

const IS_AD_READY = AD_SLOT !== "XXXXXXXXXX";

export default function AdBanner() {
  useEffect(() => {
    if (!IS_AD_READY) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

  if (!IS_AD_READY) {
    return (
      <div className="flex items-center justify-center h-[100px] bg-surface border-t border-divider">
        <span className="text-sub text-xs">광고 영역</span>
      </div>
    );
  }

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
