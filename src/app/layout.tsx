import type { Metadata, Viewport } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

export const metadata: Metadata = {
  title: "몇층 - 주차 층수 기억 앱",
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
        <div className="overflow-x-hidden">
          {children}
        </div>
        <Analytics />
      </body>
    </html>
  );
}
