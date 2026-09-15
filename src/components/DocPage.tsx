import Link from "next/link";

/** 정책·안내 등 텍스트 중심 페이지 공통 셸 */
export default function DocPage({
  title,
  lead,
  updatedAt,
  children,
}: {
  title: string;
  lead?: string;
  updatedAt?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto px-5 pt-6">
      <Link
        href="/"
        className="inline-block mb-5 px-3 py-1.5 border border-divider rounded-xl text-sub text-xs active:opacity-60"
      >
        ← 메인으로 돌아가기
      </Link>

      <h1 className="text-main text-2xl font-bold leading-tight">{title}</h1>
      {lead && <p className="text-sub text-sm leading-relaxed mt-2">{lead}</p>}
      {updatedAt && <p className="text-sub text-[11px] mt-2">최종 수정일: {updatedAt}</p>}

      <div className="mt-6 space-y-7">{children}</div>
    </div>
  );
}

export function Section({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="text-main text-base font-bold mb-2.5">{heading}</h2>
      <div className="space-y-2.5 text-sub text-sm leading-relaxed">{children}</div>
    </section>
  );
}

export function Sub({
  heading,
  children,
}: {
  heading: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <h3 className="text-main text-sm font-semibold mb-1.5">{heading}</h3>
      <div className="space-y-2 text-sub text-sm leading-relaxed">{children}</div>
    </div>
  );
}

export function Bullets({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="space-y-1.5 pl-1">
      {items.map((item, i) => (
        <li key={i} className="flex gap-2">
          <span className="text-primary flex-shrink-0 leading-relaxed">·</span>
          <span className="leading-relaxed">{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function Callout({ children }: { children: React.ReactNode }) {
  return (
    <div className="bg-primary/10 border border-primary/30 rounded-2xl px-4 py-3">
      <p className="text-main text-sm leading-relaxed">{children}</p>
    </div>
  );
}

export function DataTable({
  head,
  rows,
}: {
  head: string[];
  rows: string[][];
}) {
  return (
    <div className="border border-divider rounded-2xl overflow-hidden">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="bg-surface">
            {head.map((h) => (
              <th key={h} className="px-3 py-2 text-main font-semibold border-b border-divider">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className={i > 0 ? "border-t border-divider" : ""}>
              {row.map((cell, j) => (
                <td key={j} className="px-3 py-2 text-sub align-top leading-relaxed">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
