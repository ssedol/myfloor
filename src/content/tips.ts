export interface TipMeta {
  slug: string;
  title: string;
  /** 목록·메타 설명에 쓰는 한 줄 요약 */
  summary: string;
  /** 검색 결과용 설명 (summary보다 조금 길게) */
  description: string;
  readMinutes: number;
  updated: string;
}

export const TIPS: TipMeta[] = [
  {
    slug: "find-car-in-parking-lot",
    title: "지하주차장에서 차를 못 찾을 때, 5분 안에 찾는 순서",
    summary: "무작정 헤매지 않고 층을 좁혀 나가는 현실적인 방법",
    description:
      "지하주차장에서 차를 잃어버렸을 때 무작정 헤매지 않고 층과 구역을 체계적으로 좁혀 나가는 방법, 스마트키·블랙박스 앱·관리사무소를 활용하는 순서를 정리했습니다.",
    readMinutes: 4,
    updated: "2026-09-15",
  },
  {
    slug: "remember-parking-floor",
    title: "주차 층수를 잊지 않는 습관 7가지",
    summary: "기억에 의존하지 않고 기록이 남게 만드는 작은 규칙들",
    description:
      "지하주차장 층수를 매번 잊어버리는 이유와, 기억력이 아니라 습관과 도구로 해결하는 7가지 방법을 정리했습니다. 기둥 번호 읽는 법, 엘리베이터 앞 규칙, 기록 도구 선택 기준까지 다룹니다.",
    readMinutes: 5,
    updated: "2026-09-15",
  },
  {
    slug: "ev-charging-time",
    title: "전기차 완속·급속 충전 시간과 아파트 충전 매너",
    summary: "얼마나 걸리는지, 언제 차를 빼야 하는지",
    description:
      "전기차 완속 충전과 급속 충전에 걸리는 시간의 차이, 배터리 용량으로 충전 시간을 어림잡는 계산법, 아파트 공용 충전기를 쓸 때 지켜야 할 주차 매너와 과태료 규정 확인 방법을 안내합니다.",
    readMinutes: 6,
    updated: "2026-09-15",
  },
  {
    slug: "nfc-tag-parking",
    title: "NFC 태그로 주차 위치를 자동 저장하는 법",
    summary: "스티커 한 장으로 층 선택 과정을 없애기",
    description:
      "NFC 태그의 동작 원리, NTAG213 스티커를 지하주차장 각 층에 부착해 주차 위치를 자동 기록하는 방법, iOS와 안드로이드의 동작 차이, 아파트에 설치할 때 주의할 점을 설명합니다.",
    readMinutes: 6,
    updated: "2026-09-15",
  },
];

export function getTip(slug: string): TipMeta | undefined {
  return TIPS.find((t) => t.slug === slug);
}
