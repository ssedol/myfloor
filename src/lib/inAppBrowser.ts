// 인앱 브라우저(WebView) 감지 및 외부 브라우저 전환 유틸리티
//
// 문제: 카카오톡 등 인앱 브라우저는 localStorage가 사용자의 실제 브라우저/
// 설치된 PWA와 격리돼 있어, 공유 링크를 인앱 브라우저로 열면 등록한 차량이
// 보이지 않고 저장 데이터가 공유되지 않는다.
// 해결: 인앱 브라우저를 감지해 외부(기본) 브라우저로 전환하도록 유도한다.

export type InAppBrowser =
  | "kakaotalk"
  | "instagram"
  | "facebook"
  | "line"
  | "naver"
  | "daum"
  | "other"
  | null;

// 인앱 브라우저 종류를 판별한다. 일반 브라우저면 null.
export function detectInAppBrowser(): InAppBrowser {
  if (typeof navigator === "undefined") return null;
  const ua = navigator.userAgent;

  if (/KAKAOTALK/i.test(ua)) return "kakaotalk";
  if (/Instagram/i.test(ua)) return "instagram";
  if (/FBAN|FBAV|FB_IAB/i.test(ua)) return "facebook";
  if (/Line\//i.test(ua)) return "line";
  if (/NAVER\(inapp/i.test(ua)) return "naver";
  if (/DaumApps/i.test(ua)) return "daum";

  // 일반적인 안드로이드 WebView 시그니처 (wv) — 단, 정상 크롬은 제외
  if (/; wv\)/i.test(ua)) return "other";

  return null;
}

export function isIOS(): boolean {
  if (typeof navigator === "undefined") return false;
  return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isAndroid(): boolean {
  if (typeof navigator === "undefined") return false;
  return /Android/i.test(navigator.userAgent);
}

// 현재 URL을 외부 브라우저로 강제 전환한다.
// 전환 시도가 가능했으면 true, 수동 안내가 필요하면 false 반환.
export function openInExternalBrowser(): boolean {
  if (typeof window === "undefined") return false;
  const url = window.location.href;
  const browser = detectInAppBrowser();

  // 카카오톡: 전용 스킴으로 안드로이드·iOS 모두 외부 브라우저 전환 가능
  if (browser === "kakaotalk") {
    window.location.href =
      "kakaotalk://web/openExternal?url=" + encodeURIComponent(url);
    return true;
  }

  // 그 외 안드로이드 인앱: intent 스킴으로 크롬 강제 실행
  if (isAndroid()) {
    const scheme = window.location.protocol.replace(":", "");
    const rest = url.replace(/^https?:\/\//, "");
    window.location.href =
      `intent://${rest}#Intent;scheme=${scheme};package=com.android.chrome;end`;
    return true;
  }

  // iOS의 카카오톡 외 인앱 브라우저는 프로그래밍 방식 전환이 불가 — 수동 안내 필요
  return false;
}
