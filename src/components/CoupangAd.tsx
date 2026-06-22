"use client";

import { useEffect, useRef } from "react";

declare global {
  interface Window {
    PartnersCoupang: { G: new (config: object) => void };
  }
}

const AD_CONFIG = {
  id: 999309,
  template: "carousel",
  trackingCode: "AF1255763",
  width: "100%",
  height: "100",
  tsource: "",
};

export default function CoupangAd() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const container = containerRef.current;

    // body에 추가되는 INS를 감지해 컨테이너로 이동
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        for (const node of mutation.addedNodes) {
          if (node instanceof HTMLElement && node.tagName === "INS") {
            container.appendChild(node);
            observer.disconnect();
            return;
          }
        }
      }
    });
    observer.observe(document.body, { childList: true });

    const runAd = () => new window.PartnersCoupang.G(AD_CONFIG);

    if (window.PartnersCoupang) {
      runAd();
    } else {
      const script = document.createElement("script");
      script.src = "https://ads-partners.coupang.com/g.js";
      script.onload = runAd;
      document.head.appendChild(script);
    }

    return () => {
      observer.disconnect();
      container.innerHTML = "";
    };
  }, []);

  return <div ref={containerRef} className="w-full" />;
}
