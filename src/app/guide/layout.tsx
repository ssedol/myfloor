import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "사용 가이드 | 몇층",
  description:
    "몇층(MyFloor) 사용법을 단계별로 안내합니다. 차량 등록, 주차 층수 저장, 가족과 위치 공유, 전기차 충전 알림 설정까지 화면 그대로 따라 할 수 있습니다.",
  alternates: { canonical: "/guide" },
};

export default function GuideLayout({ children }: { children: React.ReactNode }) {
  return children;
}
