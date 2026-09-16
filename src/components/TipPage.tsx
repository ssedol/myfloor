import Link from "next/link";
import { TIPS, type TipMeta } from "@/content/tips";

/** /tips 하위 아티클 공통 셸 */
export default function TipPage({
  meta,
  children,
}: {
  meta: TipMeta;
  children: React.ReactNode;
}) {
  // 목록 전체를 나열하면 길어져 세 편만 노출한다.
  const others = TIPS.filter((t) => t.slug !== meta.slug).slice(0, 3);

  return (
    <article className="max-w-md mx-auto px-5 pt-6">
      <Link
        href="/tips"
        className="inline-block mb-5 px-3 py-1.5 border border-divider rounded-xl text-sub text-xs active:opacity-60"
      >
        ← 주차 정보 목록
      </Link>

      <h1 className="text-main text-2xl font-bold leading-snug">{meta.title}</h1>
      <p className="text-sub text-[11px] mt-2">
        읽는 데 약 {meta.readMinutes}분 · 최종 수정 {meta.updated}
      </p>

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
      </div>
    </article>
  );
}
