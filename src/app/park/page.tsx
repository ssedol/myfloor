import type { Metadata } from "next";
import ParkClient from "./ParkClient";

export const metadata: Metadata = {
  // 개인 주차 기록 진입용 딥링크 — 검색 색인 대상이 아니다.
  robots: { index: false, follow: false },
};


export default async function ParkPage({
  searchParams,
}: {
  searchParams: Promise<{ floor?: string }>;
}) {
  const { floor } = await searchParams;
  return <ParkClient floor={floor ?? null} />;
}
