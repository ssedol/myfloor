"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { isEntryPath } from "@/lib/routes";

const NAV = [
  { href: "/", label: "홈" },
  { href: "/guide", label: "사용 가이드" },
  { href: "/tips", label: "주차 정보" },
  { href: "/faq", label: "자주 묻는 질문" },
  { href: "/about", label: "소개" },
];

/**
 * 모든 콘텐츠 화면 위에 붙는 전역 내비게이션.
 *
 * 태그 진입 화면(/park, /nfc)은 1.8초 뒤 리다이렉트되는 화면이라 제외한다.
 */
export default function SiteHeader() {
  const pathname = usePathname();
  if (isEntryPath(pathname)) return null;

  const isCurrent = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);

  return (
    <header className="sticky top-0 z-30 bg-app-bg/95 backdrop-blur-sm border-b border-divider">
      <div className="max-w-md mx-auto px-5 h-12 flex items-center gap-3">
        <Link
          href="/"
          className="text-main text-sm font-bold flex-shrink-0 active:opacity-60"
          aria-label="몇층 홈으로"
        >
          몇층
        </Link>
        <nav aria-label="주요 메뉴" className="min-w-0 flex-1">
          <ul className="flex items-center gap-3 overflow-x-auto no-scrollbar">
            {NAV.map(({ href, label }) => (
              <li key={href} className="flex-shrink-0">
                <Link
                  href={href}
                  aria-current={isCurrent(href) ? "page" : undefined}
                  className={
                    isCurrent(href)
                      ? "text-main text-xs font-semibold border-b-2 border-primary pb-0.5"
                      : "text-sub text-xs active:opacity-60"
                  }
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
