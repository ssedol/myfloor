import type { Metadata } from "next";
import Link from "next/link";
import DocPage from "@/components/DocPage";
import { FaqEntry } from "@/components/FaqSection";
import JsonLd from "@/components/JsonLd";
import { FAQS } from "@/content/faq";

export const metadata: Metadata = {
  title: "자주 묻는 질문 | 몇층",
  description:
    "몇층(MyFloor) 사용법, 전기차 충전 알림, 홈 화면 설치, 데이터 보관 방식, 개인정보 처리에 대해 자주 묻는 질문을 모았습니다.",
  alternates: { canonical: "/faq" },
};

/** FAQPage 구조화 데이터 — 검색 결과에 질문·답변이 노출되도록 */
const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: FAQS.flatMap(({ items }) =>
    items.map(({ q, a }) => ({
      "@type": "Question",
      name: q,
      acceptedAnswer: { "@type": "Answer", text: a },
    })),
  ),
};

export default function FaqPage() {
  return (
    <>
      <JsonLd data={faqJsonLd} />
      <DocPage
        title="자주 묻는 질문"
        lead="몇층을 쓰면서 가장 많이 받은 질문을 모았습니다. 답을 찾지 못하셨다면 아래 문의처로 연락 주세요."
      >
        {FAQS.map(({ group, items }) => (
          <section key={group}>
            <h2 className="text-main text-base font-bold mb-2.5">{group}</h2>
            {items.map((item) => (
              <FaqEntry key={item.q} {...item} />
            ))}
          </section>
        ))}

        <section>
          <h2 className="text-main text-base font-bold mb-2.5">여기서 답을 못 찾으셨다면</h2>
          <p className="text-sub text-sm leading-relaxed">
            <Link href="/guide" className="text-main underline underline-offset-2">
              사용 가이드
            </Link>
            와{" "}
            <Link href="/tips" className="text-main underline underline-offset-2">
              주차 정보
            </Link>
            에 더 자세한 설명이 있습니다. 그래도 해결되지 않으면 카카오톡 오픈채팅으로 알려주세요.
          </p>
          <a
            href="https://open.kakao.com/o/sj3lSPAi"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block mt-3 px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl active:opacity-70"
          >
            카카오톡 오픈채팅으로 문의하기
          </a>
        </section>
      </DocPage>
    </>
  );
}
