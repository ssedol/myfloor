"use client";

import Script from "next/script";

export default function KakaoAd() {
  return (
    <div className="w-full">
      <ins
        className="kakao_ad_area"
        style={{ display: "none", width: "100%" }}
        data-ad-unit="DAN-Rfsmw2Cumar7lRX2"
        data-ad-width="320"
        data-ad-height="50"
      />
      <Script
        src="https://t1.kakaocdn.net/kas/static/ba.min.js"
        strategy="afterInteractive"
      />
    </div>
  );
}
