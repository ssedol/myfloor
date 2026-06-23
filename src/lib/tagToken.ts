import { createHmac, timingSafeEqual } from "crypto";

// 주의: 이 모듈은 서버에서만 사용할 것. NFC_TAG_SECRET이 클라이언트로
// 노출되면 안 되므로 클라이언트 컴포넌트에서 import 금지.

// NFC/QR 태그 위조 방지용 HMAC 서명.
// 비밀키(NFC_TAG_SECRET)를 모르면 유효한 sig를 만들 수 없으므로
// 외부에서 임의로 태그/QR을 생성해 무단 사용하는 것을 차단한다.

function getSecret(): string {
  const secret = process.env.NFC_TAG_SECRET;
  if (!secret) {
    throw new Error("NFC_TAG_SECRET 환경변수가 설정되지 않았습니다");
  }
  return secret;
}

/** 층 문자열에 대한 서명(base64url 앞 16자 = 96bit) 생성 */
export function signFloor(floor: string): string {
  return createHmac("sha256", getSecret())
    .update(floor)
    .digest("base64url")
    .slice(0, 16);
}

/** 전달된 sig가 해당 층의 정품 서명과 일치하는지 검증 */
export function verifyFloor(floor: string, sig: string | null | undefined): boolean {
  if (!sig) return false;
  const expected = signFloor(floor);
  if (expected.length !== sig.length) return false;
  try {
    return timingSafeEqual(Buffer.from(expected), Buffer.from(sig));
  } catch {
    return false;
  }
}
