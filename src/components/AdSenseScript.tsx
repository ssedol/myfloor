"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { AD_CLIENT } from "@/config/adsense";
import { isAdAllowedPath } from "@/lib/adPolicy";

/**
 * AdSense 스크립트를 콘텐츠가 있는 화면에서만 로드한다.
 * 이전에는 root layout <head>에 직접 넣어 /park, /nfc 같은
 * 콘텐츠 없는 전환 화면에서도 로드됐다.
 */
export default function AdSenseScript() {
  const pathname = usePathname();
  if (!isAdAllowedPath(pathname)) return null;

  return (
    <Script
      id="adsbygoogle-init"
      async
      strategy="afterInteractive"
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
