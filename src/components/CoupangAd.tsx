"use client";

import Script from "next/script";

declare global {
  interface Window {
    PartnersCoupang: { G: new (config: object) => void };
  }
}

export default function CoupangAd() {
  return (
    <Script
      src="https://ads-partners.coupang.com/g.js"
      strategy="afterInteractive"
      onLoad={() => {
        new window.PartnersCoupang.G({
          id: 999309,
          template: "carousel",
          trackingCode: "AF1255763",
          width: "100%",
          height: "100",
          tsource: "",
        });
      }}
    />
  );
}
