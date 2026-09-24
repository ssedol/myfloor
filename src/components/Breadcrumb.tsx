import Link from "next/link";
import JsonLd from "@/components/JsonLd";

const BASE_URL = "https://myfloor.website";

export interface Crumb {
  /** 마지막 항목은 href 없이 현재 위치로만 표시한다. */
  href?: string;
  label: string;
}

/**
 * 화면에 보이는 빵부스러기 + 같은 내용의 BreadcrumbList 구조화 데이터.
 *
 * 사람과 크롤러가 같은 경로를 보게 해서 "이 글이 사이트 어디에 속한 글인지"를
 * 명확히 한다.
 */
export default function Breadcrumb({ items }: { items: Crumb[] }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.label,
      ...(item.href ? { item: `${BASE_URL}${item.href}` } : {}),
    })),
  };

  return (
    <>
      <JsonLd data={jsonLd} />
      <nav aria-label="현재 위치" className="mb-4">
        <ol className="flex flex-wrap items-center gap-1 text-sub text-[11px]">
          {items.map((item, i) => (
            <li key={item.label} className="flex items-center gap-1">
              {i > 0 && (
                <span aria-hidden className="text-divider">
                  ›
                </span>
              )}
              {item.href ? (
                <Link href={item.href} className="underline underline-offset-2 active:opacity-60">
                  {item.label}
                </Link>
              ) : (
                <span aria-current="page" className="text-main font-medium">
                  {item.label}
                </span>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
}
