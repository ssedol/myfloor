import Link from "next/link";
import Breadcrumb from "@/components/Breadcrumb";
import JsonLd from "@/components/JsonLd";
import { TIPS, type TipMeta } from "@/content/tips";
import { AUTHOR_NAME, AUTHOR_ROLE, BASE_URL, SITE_NAME } from "@/content/site";

export interface TocItem {
  id: string;
  label: string;
}

/** /tips 하위 아티클 공통 셸 */
export default function TipPage({
  meta,
  toc,
  children,
}: {
  meta: TipMeta;
  /** 각 Section 의 id 와 1:1로 맞춘 목차 */
  toc?: TocItem[];
  children: React.ReactNode;
}) {
  // 목록 전체를 나열하면 길어져 네 편만 노출한다.
  const others = TIPS.filter((t) => t.slug !== meta.slug).slice(0, 4);
  const url = `${BASE_URL}/tips/${meta.slug}`;

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: meta.title,
    description: meta.description,
    inLanguage: "ko-KR",
    datePublished: meta.published,
    dateModified: meta.updated,
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
    url,
    author: { "@type": "Person", name: AUTHOR_NAME, url: `${BASE_URL}/about` },
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: BASE_URL,
      logo: { "@type": "ImageObject", url: `${BASE_URL}/logo.png` },
    },
  };

  return (
    <article className="max-w-md mx-auto px-5 pt-5">
      <JsonLd data={articleJsonLd} />

      <Breadcrumb
        items={[
          { href: "/", label: "홈" },
          { href: "/tips", label: "주차 정보" },
          { label: meta.title },
        ]}
      />

      <h1 className="text-main text-2xl font-bold leading-snug">{meta.title}</h1>
      <p className="text-sub text-sm leading-relaxed mt-2">{meta.summary}</p>

      <div className="mt-3 pb-4 border-b border-divider">
        <p className="text-sub text-[11px] leading-relaxed">
          글{" "}
          <Link href="/about" className="text-main font-medium underline underline-offset-2">
            {AUTHOR_NAME}
          </Link>{" "}
          · {AUTHOR_ROLE}
        </p>
        <p className="text-sub text-[11px] leading-relaxed mt-0.5">
          <time dateTime={meta.published}>{meta.published} 발행</time>
          {meta.updated !== meta.published && (
            <>
              {" · "}
              <time dateTime={meta.updated}>{meta.updated} 수정</time>
            </>
          )}
          {" · "}읽는 데 약 {meta.readMinutes}분
        </p>
      </div>

      {toc && toc.length > 0 && (
        <nav aria-label="목차" className="mt-5 bg-surface rounded-2xl px-4 py-3.5">
          <p className="text-main text-xs font-bold mb-2">목차</p>
          <ol className="space-y-1.5">
            {toc.map((item, i) => (
              <li key={item.id} className="flex gap-2 text-[13px] leading-relaxed">
                <span className="text-sub flex-shrink-0 tabular-nums">{i + 1}.</span>
                <a
                  href={`#${item.id}`}
                  className="text-sub underline underline-offset-2 active:opacity-60"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ol>
        </nav>
      )}

      <div className="mt-6 space-y-7">{children}</div>

      <div className="mt-10 pt-6 border-t border-divider">
        <h2 className="text-main text-sm font-bold mb-3">함께 읽어보세요</h2>
        <ul className="space-y-2">
          {others.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tips/${t.slug}`}
                className="block bg-surface rounded-2xl px-4 py-3 active:opacity-70"
              >
                <p className="text-main text-sm font-semibold leading-snug">{t.title}</p>
                <p className="text-sub text-xs mt-1">{t.summary}</p>
              </Link>
            </li>
          ))}
        </ul>
        <Link
          href="/tips"
          className="mt-3 block text-center border border-divider rounded-2xl px-4 py-2.5 text-sub text-xs active:opacity-60"
        >
          주차 정보 글 {TIPS.length}편 전체 보기
        </Link>
      </div>
    </article>
  );
}
