/**
 * 태그·공유 링크로 들어오는 진입 화면.
 *
 * - /park : NFC·QR·공유 링크로 들어와 "저장 완료 ✓" 를 보여주고 1.8초 뒤 메인으로 보내는 화면
 * - /nfc  : 위와 같은 태그 진입 화면 (/nfc/admin 은 태그 URL 발급용 내부 도구)
 *
 * 읽을거리가 없고 곧바로 리다이렉트되는 화면이라 사이트 내비게이션도,
 * 광고 스크립트도 붙이지 않는다.
 */
const ENTRY_PREFIXES = ["/park", "/nfc"];

export function isEntryPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return ENTRY_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
