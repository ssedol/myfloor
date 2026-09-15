import type { Metadata } from "next";
import Link from "next/link";
import DocPage, { Section } from "@/components/DocPage";
import { TIPS } from "@/content/tips";

export const metadata: Metadata = {
  title: "주차 정보 | 몇층",
  description:
    "지하주차장에서 차를 찾는 방법, 주차 층수를 기억하는 습관, 전기차 충전 시간, NFC 태그 활용법 등 주차 생활에 도움이 되는 정보를 모았습니다.",
  alternates: { canonical: "/tips" },
};

export default function TipsIndexPage() {
  return (
    <DocPage
      title="주차 정보"
      lead="지하주차장을 매일 이용하면서 겪는 문제들을 정리했습니다. 차를 못 찾을 때의 대처법부터 전기차 충전 매너까지, 실제로 써먹을 수 있는 내용만 담았습니다."
    >
      <section>
        <ul className="space-y-3">
          {TIPS.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tips/${t.slug}`}
                className="block bg-surface rounded-2xl px-4 py-4 active:opacity-70"
              >
                <h2 className="text-main text-[15px] font-bold leading-snug">{t.title}</h2>
                <p className="text-sub text-sm leading-relaxed mt-1.5">{t.summary}</p>
                <p className="text-sub text-[11px] mt-2">읽는 데 약 {t.readMinutes}분</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Section heading="몇층은 어떤 앱인가요">
        <p>
          위 글들을 쓴 몇층(MyFloor)은 주차한 층수를 탭 두 번으로 저장하고 다시 찾는 무료 웹앱입니다.
          회원가입이 없고, 기록은 사용자 기기에만 저장됩니다.{" "}
          <Link href="/about" className="text-main underline underline-offset-2">
            서비스 소개
          </Link>
          에서 자세히 확인할 수 있습니다.
        </p>
      </Section>
    </DocPage>
  );
}
