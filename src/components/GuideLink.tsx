"use client";

import Link from "next/link";

export default function GuideLink() {
  return (
    <Link
      href="/guide"
      className="flex items-center justify-between bg-surface rounded-2xl px-4 py-3 mb-3 active:opacity-70 transition-opacity"
    >
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="5" r="1.5" fill="white" />
            <rect x="6.75" y="7.5" width="2.5" height="5" rx="1.25" fill="white" />
          </svg>
        </div>
        <div>
          <p className="text-main text-sm font-semibold leading-tight">처음 사용하시나요?</p>
          <p className="text-sub text-xs">이용 가이드 보기</p>
        </div>
      </div>
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sub flex-shrink-0">
        <path d="M6 4l4 4-4 4" />
      </svg>
    </Link>
  );
}
