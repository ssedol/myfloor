import Breadcrumb, { type Crumb } from "@/components/Breadcrumb";

/** 정책·안내 등 텍스트 중심 페이지 공통 셸 */
export default function DocPage({
  title,
  lead,
  updatedAt,
  breadcrumb,
  children,
}: {
  title: string;
  lead?: string;
  updatedAt?: string;
  /** 현재 위치 표시. 지정하지 않으면 홈 > 이 페이지 로 그린다. */
  breadcrumb?: Crumb[];
  children: React.ReactNode;
}) {
  return (
    <div className="max-w-md mx-auto px-5 pt-5">
      <Breadcrumb items={breadcrumb ?? [{ href: "/", label: "홈" }, { label: title }]} />

      <h1 className="text-main text-2xl font-bold leading-tight">{title}</h1>
      {lead && <p className="text-sub text-sm leading-relaxed mt-2">{lead}</p>}
      {updatedAt && <p className="text-sub text-[11px] mt-2">최종 수정일: {updatedAt}</p>}

      <div className="mt-6 space-y-7">{children}</div>
    </div>
  );
}

export function Section({
  heading,
  id,
  children,
}: {
  heading: string;
  /** 목차에서 건너뛸 수 있게 하는 앵커 id */
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className={id ? "scroll-mt-16" : undefined}>
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

/**
 * 글 맨 앞에 두는 핵심 요약 상자.
 * 끝까지 읽지 않는 독자도 결론만은 가져갈 수 있게 한다.
 */
export function KeyPoints({ items }: { items: React.ReactNode[] }) {
  return (
    <aside className="bg-surface border border-divider rounded-2xl px-4 py-3.5">
      <p className="text-main text-xs font-bold mb-2">이 글의 핵심</p>
      <ul className="space-y-1.5">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2 text-sub text-[13px] leading-relaxed">
            <span className="text-primary-dark flex-shrink-0 font-bold">✓</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
}

/** 글 안에서 실제로 따라 하며 체크할 수 있는 목록 */
export function Checklist({
  title,
  items,
}: {
  title: string;
  items: React.ReactNode[];
}) {
  return (
    <div className="border border-divider rounded-2xl px-4 py-3.5">
      <p className="text-main text-xs font-bold mb-2">{title}</p>
      <ul className="space-y-2">
        {items.map((item, i) => (
          <li key={i} className="flex gap-2.5 text-sub text-[13px] leading-relaxed">
            <span
              aria-hidden
              className="mt-0.5 w-3.5 h-3.5 flex-shrink-0 rounded-[4px] border-[1.5px] border-divider"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/**
 * 글에서 다룬 제도·규격·수치의 근거를 확인할 수 있는 공공기관 목록.
 *
 * 기관 홈페이지 주소만 싣고 "무엇을 찾아보면 되는지"를 함께 적는다.
 * 세부 페이지 주소는 개편 때마다 바뀌어 깨진 링크가 되기 쉽기 때문이다.
 */
export function Sources({
  items,
}: {
  items: { name: string; url: string; note: string }[];
}) {
  return (
    <section className="border-t border-divider pt-5">
      <h2 className="text-main text-sm font-bold mb-1.5">확인해 볼 곳</h2>
      <p className="text-sub text-[11px] leading-relaxed mb-2.5">
        아래는 이 글에서 다룬 제도와 수치를 직접 확인할 수 있는 공공기관입니다. 규정과 요금은
        지역·시기·단지 규약에 따라 다르므로, 중요한 판단은 아래에서 원문을 확인하시기 바랍니다.
      </p>
      <ul className="space-y-1.5">
        {items.map(({ name, url, note }) => (
          <li key={url} className="text-sub text-[12px] leading-relaxed">
            <a
              href={url}
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-main underline underline-offset-2 font-medium"
            >
              {name}
            </a>
            <span> — {note}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
