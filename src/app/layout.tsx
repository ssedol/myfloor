import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "몇층 - 주차 층수 기억 앱",
    template: "%s",
  },
  description: "주차한 층수를 한 번에 저장하고 가족과 공유하세요. 가입 없이 무료로 사용할 수 있는 주차 층수 기억 앱입니다.",
  keywords: ["주차 층수", "주차 기억", "아파트 주차", "주차 앱", "층수 저장", "몇층"],
  metadataBase: new URL("https://myfloor.website"),
  alternates: { canonical: "/" },
  openGraph: {
    title: "몇층 - 주차 층수 기억 앱",
    description: "주차한 층수를 한 번에 저장하고 가족과 공유하세요.",
    url: "https://myfloor.website",
    siteName: "몇층",
    locale: "ko_KR",
    type: "website",
  },
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "몇층",
  },
};

export const viewport: Viewport = {
  themeColor: "#9BC72E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/** 사이트 정체성을 명시하는 구조화 데이터 */
const siteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "몇층 (MyFloor)",
  url: "https://myfloor.website",
  applicationCategory: "UtilitiesApplication",
  operatingSystem: "iOS, Android, Web",
  inLanguage: "ko-KR",
  description:
    "주차한 층수를 저장하고 다시 찾는 무료 웹앱. 회원가입 없이 사용하며 기록은 사용자 기기에만 저장됩니다.",
  offers: { "@type": "Offer", price: "0", priceCurrency: "KRW" },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable.min.css"
        />
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4773298245322018"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-app-bg font-pretendard antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(siteJsonLd) }}
        />
        <div className="overflow-x-hidden">
          {children}
          <SiteFooter />
        </div>
        <Analytics />
      </body>
    </html>
  );
}
