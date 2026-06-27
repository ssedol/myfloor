"use client";

import { useEffect, useState } from "react";
import {
  detectInAppBrowser,
  openInExternalBrowser,
  isIOS,
  type InAppBrowser,
} from "@/lib/inAppBrowser";

interface Props {
  // true면 인앱 브라우저 감지 시 자동으로 외부 브라우저 전환을 시도한다.
  autoRedirect?: boolean;
}

const LABELS: Record<string, string> = {
  kakaotalk: "카카오톡",
  instagram: "인스타그램",
  facebook: "페이스북",
  line: "라인",
  naver: "네이버 앱",
  daum: "다음 앱",
  other: "인앱",
};

export default function InAppBrowserGuide({ autoRedirect = true }: Props) {
  const [browser, setBrowser] = useState<InAppBrowser>(null);
  const [ios, setIos] = useState(false);

  useEffect(() => {
    const detected = detectInAppBrowser();
    if (!detected) return;
    setBrowser(detected);
    setIos(isIOS());

    // 카카오톡은 자동 전환이 안정적이라 바로 시도
    if (autoRedirect && detected === "kakaotalk") {
      openInExternalBrowser();
    }
  }, [autoRedirect]);

  if (!browser) return null;

  const label = LABELS[browser] ?? "인앱";
  // 카카오톡, 또는 안드로이드 인앱은 버튼으로 전환 시도 가능. iOS의 비-카카오 인앱만 수동 안내.
  const canRedirect = browser === "kakaotalk" || !ios;

  return (
    <div className="fixed inset-0 z-[100] bg-black/60 flex items-end sm:items-center justify-center p-4">
      <div className="bg-app-bg rounded-3xl w-full max-w-sm p-6 text-center">
        <div className="text-4xl mb-3">🌐</div>
        <p className="text-main font-bold text-lg mb-2">
          기본 브라우저로 열어주세요
        </p>
        <p className="text-sub text-sm leading-relaxed mb-5">
          {label} 안에서는 저장된 차량과 주차 정보가 보이지 않아요.
          <br />
          Safari·Chrome 같은 기본 브라우저로 열어야 정상적으로 사용할 수 있어요.
        </p>

        {canRedirect ? (
          <button
            onClick={() => openInExternalBrowser()}
            className="w-full py-3.5 bg-primary text-white text-sm font-semibold rounded-2xl active:bg-primary-dark transition-colors"
          >
            기본 브라우저에서 열기
          </button>
        ) : (
          <div className="bg-surface rounded-2xl p-4 text-left">
            <p className="text-main text-sm font-semibold mb-2">
              이렇게 열어주세요 👇
            </p>
            <ol className="text-sub text-sm leading-relaxed list-decimal list-inside space-y-1">
              <li>
                오른쪽 아래(또는 위) <b className="text-main">⋯ 메뉴</b> 탭
              </li>
              <li>
                <b className="text-main">{ios ? "Safari로 열기" : "다른 브라우저로 열기"}</b>{" "}
                선택
              </li>
            </ol>
          </div>
        )}

        <p className="text-sub text-xs mt-4 leading-relaxed">
          한 번 기본 브라우저로 연 뒤 홈 화면에 설치하면
          <br />
          다음부터는 이 안내가 보이지 않아요.
        </p>
      </div>
    </div>
  );
}
