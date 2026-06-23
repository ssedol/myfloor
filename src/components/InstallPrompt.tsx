"use client";

import { useEffect, useRef, useState } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

function isStandalone() {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    (navigator as { standalone?: boolean }).standalone === true
  );
}

function isIOS() {
  return /iPhone|iPad|iPod/.test(navigator.userAgent);
}

export default function InstallPrompt() {
  const [show, setShow] = useState(false);
  const [ios, setIos] = useState(false);
  const deferredPrompt = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (isStandalone()) return;
    if (sessionStorage.getItem("install_shown")) return;

    const iosDevice = isIOS();
    setIos(iosDevice);

    if (iosDevice) {
      const t = setTimeout(() => {
        sessionStorage.setItem("install_shown", "1");
        setShow(true);
      }, 3000);
      return () => clearTimeout(t);
    } else {
      const handler = (e: Event) => {
        e.preventDefault();
        deferredPrompt.current = e as BeforeInstallPromptEvent;
        setTimeout(() => {
          sessionStorage.setItem("install_shown", "1");
          setShow(true);
        }, 3000);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  async function handleInstall() {
    if (!deferredPrompt.current) return;
    await deferredPrompt.current.prompt();
    setShow(false);
  }

  if (!show) return null;

  return (
    <div className="fixed bottom-8 left-4 right-4 z-50 max-w-md mx-auto">
      <div className="bg-app-bg border border-divider rounded-2xl shadow-md px-5 py-4">
        <div className="flex items-start gap-3">
          <span className="text-xl flex-shrink-0">📱</span>
          <div className="flex-1 min-w-0">
            <p className="text-main text-sm font-semibold">앱으로 설치하면 더 편해요</p>
            {ios ? (
              <p className="text-sub text-xs mt-1 leading-snug">
                Safari 하단 공유 버튼 → <b className="text-main">홈 화면에 추가</b>를 눌러주세요.
                설치해야 전기차 충전 알림을 받을 수 있어요.
              </p>
            ) : (
              <p className="text-sub text-xs mt-1 leading-snug">
                홈 화면에 추가하면 전기차 충전 알림도 받을 수 있어요.
              </p>
            )}
            {!ios && deferredPrompt.current && (
              <button
                onClick={handleInstall}
                className="mt-2 bg-primary text-white text-xs font-bold px-4 py-1.5 rounded-xl"
              >
                설치하기
              </button>
            )}
          </div>
          <button
            onClick={() => setShow(false)}
            className="text-sub text-xl leading-none flex-shrink-0 -mt-0.5"
            aria-label="닫기"
          >
            ×
          </button>
        </div>
      </div>
    </div>
  );
}
