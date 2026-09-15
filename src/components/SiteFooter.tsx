import Link from "next/link";

const LINKS = [
  { href: "/about", label: "서비스 소개" },
  { href: "/guide", label: "사용 가이드" },
  { href: "/tips", label: "주차 정보" },
  { href: "/faq", label: "자주 묻는 질문" },
  { href: "/privacy", label: "개인정보처리방침" },
  { href: "/terms", label: "이용약관" },
];

export default function SiteFooter() {
  return (
    <footer className="max-w-md mx-auto px-5 pt-8 pb-10">
      <div className="border-t border-divider pt-5">
        <nav aria-label="사이트 안내">
          <ul className="flex flex-wrap gap-x-3 gap-y-1.5 mb-4">
            {LINKS.map(({ href, label }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="text-sub text-xs underline underline-offset-2 active:opacity-60"
                >
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <p className="text-main text-xs font-semibold mb-1">몇층 (MyFloor)</p>
        <p className="text-sub text-[11px] leading-relaxed">
          주차한 층수를 기록하고 다시 찾는 무료 웹앱입니다. 회원가입 없이 사용할 수 있으며,
          주차 기록은 사용자 기기의 브라우저에만 저장됩니다.
        </p>
        <p className="text-sub text-[11px] leading-relaxed mt-2">
          문의:{" "}
          <a
            href="https://open.kakao.com/o/sj3lSPAi"
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2"
          >
            카카오톡 오픈채팅
          </a>
        </p>
        <p className="text-sub text-[11px] mt-2">© {new Date().getFullYear()} 몇층 (MyFloor)</p>
      </div>
    </footer>
  );
}
