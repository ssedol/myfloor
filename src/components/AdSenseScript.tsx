"use client";

import { usePathname } from "next/navigation";
import { AD_CLIENT } from "@/config/adsense";
import { isAdAllowedPath } from "@/lib/adPolicy";

/**
 * AdSense 스크립트를 콘텐츠가 있는 화면에서만 로드한다.
 *
 * next/script 대신 평범한 <script async>를 쓴다. next/script는 SSR HTML에
 * <link rel="preload">만 남기고 실제 <script> 태그는 하이드레이션 이후에
 * 삽입하는데, 애드센스 심사는 서버가 내려준 HTML에서 스니펫을 확인하므로
 * 그 방식은 위험하다. React 19는 <script async src>를 트리 어디에 두든
 * <head>로 끌어올려 주므로 이 컴포넌트가 본문에 있어도 head에 렌더된다.
 */
export default function AdSenseScript() {
  const pathname = usePathname();
  if (!isAdAllowedPath(pathname)) return null;

  return (
    <script
      async
      src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${AD_CLIENT}`}
      crossOrigin="anonymous"
    />
  );
}
