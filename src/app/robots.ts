import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // 개인 주차 기록 진입용 딥링크와 관리자 도구는 색인 대상이 아니다.
      disallow: ["/park", "/nfc", "/api/"],
    },
    sitemap: "https://myfloor.website/sitemap.xml",
  };
}
