import Link from "next/link";
import { FAQS, type FaqItem } from "@/content/faq";

/**
 * <details>로 구현해 접혀 있어도 본문이 DOM에 존재한다.
 * (이전 useState 구현은 닫힌 상태에서 텍스트가 아예 렌더링되지 않아
 *  검색엔진·광고 심사 크롤러가 FAQ 내용을 전혀 볼 수 없었다.)
 */
export function FaqEntry({ q, a, link, linkLabel, highlight }: FaqItem) {
  return (
    <details className="bg-surface rounded-2xl overflow-hidden mb-2 group">
      <summary className="w-full text-left px-4 py-3.5 flex justify-between items-center gap-3 cursor-pointer list-none active:opacity-70 transition-opacity [&::-webkit-details-marker]:hidden">
        <h3 className="text-main text-sm font-semibold">{q}</h3>
        <span className="text-primary text-lg font-light flex-shrink-0 transition-transform group-open:rotate-45">
          ﹢
        </span>
      </summary>
      <div className="px-4 pb-4">
        <p className="text-sub text-sm leading-relaxed">{a}</p>
        {highlight && (
          <div className="mt-2.5 px-3 py-2.5 bg-primary/10 border border-primary/30 rounded-xl">
            <p className="text-primary-dark text-xs font-semibold leading-relaxed">{highlight}</p>
          </div>
        )}
        {link && (
          <a
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-2 px-4 py-2 bg-primary text-white text-xs font-semibold rounded-xl active:opacity-70"
          >
            {linkLabel}
          </a>
        )}
      </div>
    </details>
  );
}

export default function FaqSection() {
  return (
    <details className="mt-2 pb-2 group">
      <summary className="w-full flex items-center justify-center gap-2 py-2 text-sub text-xs font-medium cursor-pointer list-none active:opacity-70 transition-opacity [&::-webkit-details-marker]:hidden">
        이용 안내 및 자주 묻는 질문
        <span className="text-[10px] transition-transform group-open:rotate-180">▼</span>
      </summary>

      <div className="mt-4">
        {FAQS.map(({ group, items }) => (
          <div key={group} className="mb-4">
            <h2 className="text-sub text-xs font-bold tracking-widest mb-2 px-1">{group}</h2>
            {items.map((item) => (
              <FaqEntry key={item.q} {...item} />
            ))}
          </div>
        ))}

        <Link
          href="/faq"
          className="block text-center text-sub text-xs underline underline-offset-2 py-2 active:opacity-60"
        >
          전체 도움말 페이지로 보기
        </Link>
      </div>
    </details>
  );
}
