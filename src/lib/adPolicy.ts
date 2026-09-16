/**
 * 광고를 노출해도 되는 화면을 한 곳에서 정의한다.
 *
 * AdSense 정책 "게시자 콘텐츠가 없는 화면에 Google 게재 광고"는
 * 읽을거리가 없는 화면(전환/완료/오류 화면, 내부 도구 등)에 광고를 붙이는 것을
 * 금지한다. 아래 경로들은 모두 그런 화면이라 광고는 물론 광고 스크립트 자체를
 * 로드하지 않는다.
 *
 * - /park  : NFC·QR·공유 링크 진입 후 "저장 완료 ✓" 뒤 1.8초 만에 리다이렉트되는 화면
 * - /nfc   : 위와 동일한 태그 진입 화면
 * - /nfc/admin : 태그 URL 발급용 내부 도구 (/nfc 접두사로 함께 차단)
 */
const NO_AD_PREFIXES = ["/park", "/nfc"];

export function isAdAllowedPath(pathname: string | null | undefined): boolean {
  if (!pathname) return false;
  return !NO_AD_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
