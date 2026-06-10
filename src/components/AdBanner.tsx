"use client";

import { useEffect } from "react";

declare global {
  interface Window {
    adsbygoogle: unknown[];
  }
}

import { AD_CLIENT, AD_SLOT } from "@/config/adsense";

export default function AdBanner() {
  useEffect(() => {
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {}
  }, []);

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
