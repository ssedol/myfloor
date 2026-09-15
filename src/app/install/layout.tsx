import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "홈 화면 설치 방법 | 몇층",
  description:
    "아이폰 Safari와 안드로이드 Chrome에서 몇층(MyFloor)을 홈 화면에 추가하는 방법을 단계별로 안내합니다. 설치해야 주차 기록이 안전하게 유지되고 충전 알림을 받을 수 있습니다.",
  alternates: { canonical: "/install" },
};

export default function InstallLayout({ children }: { children: React.ReactNode }) {
  return children;
}
