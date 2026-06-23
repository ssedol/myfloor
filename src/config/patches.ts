export interface Patch {
  id: string;
  message: string;
}

export const PATCHES: Patch[] = [
  { id: "v1.1-sublocation", message: "✨ 층수 선택 후 기둥·구역 번호도 저장할 수 있어요" },
  { id: "v1.2-alarm", message: "⚡ 전기차 충전 알림 기능이 추가됐어요! 층수 저장 시 충전 알림을 설정할 수 있어요" },
];

export function getLatestPatch(): Patch | null {
  return PATCHES[PATCHES.length - 1] ?? null;
}
