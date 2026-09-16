import type { Metadata } from "next";
import Link from "next/link";
import DocPage, { Section, Bullets } from "@/components/DocPage";
import { TIPS } from "@/content/tips";

export const metadata: Metadata = {
  title: "주차 정보 | 몇층",
  description:
    "지하주차장에서 차를 찾는 방법, 주차 층수를 기억하는 습관, 전기차 충전 시간, NFC 태그 활용, 주차 분쟁 대처, 기계식 주차장 이용법 등 주차 생활에 도움이 되는 글을 모았습니다.",
  alternates: { canonical: "/tips" },
};

export default function TipsIndexPage() {
  return (
    <DocPage
      title="주차 정보"
      lead="지하주차장을 매일 이용하면서 겪는 문제들을 정리했습니다. 원론적인 이야기 대신 실제로 써먹을 수 있는 내용만 담았습니다."
    >
      <section>
        <p className="text-sub text-sm leading-relaxed mb-5">
          아파트 지하주차장은 B8까지 내려가고 한 층이 축구장 몇 개 넓이인 경우도 흔합니다. 차를 어디에
          세웠는지 잊는 일부터, 옆 차와의 마찰, 전기차 충전 자리 눈치싸움, 장마철 침수 걱정까지
          주차와 얽힌 고민은 생각보다 많습니다. 아래 글들은 그중 자주 반복되는 것들을 하나씩 다룹니다.
        </p>

        <ul className="space-y-3">
          {TIPS.map((t) => (
            <li key={t.slug}>
              <Link
                href={`/tips/${t.slug}`}
                className="block bg-surface rounded-2xl px-4 py-4 active:opacity-70"
              >
                <h2 className="text-main text-[15px] font-bold leading-snug">{t.title}</h2>
                <p className="text-main text-xs font-medium leading-snug mt-1">{t.summary}</p>
                <p className="text-sub text-[13px] leading-relaxed mt-2">{t.blurb}</p>
                <p className="text-sub text-[11px] mt-2.5">읽는 데 약 {t.readMinutes}분</p>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <Section heading="어디부터 읽으면 좋을까">
        <Bullets
          items={[
            <>
              <strong className="text-main">지금 당장 차를 못 찾고 있다면</strong> —{" "}
              <Link href="/tips/find-car-in-parking-lot" className="text-main underline underline-offset-2">
                5분 안에 찾는 순서
              </Link>
              부터 보세요.
            </>,
            <>
              <strong className="text-main">매번 층수를 잊는다면</strong> —{" "}
              <Link href="/tips/remember-parking-floor" className="text-main underline underline-offset-2">
                습관 7가지
              </Link>
              와{" "}
              <Link href="/tips/nfc-tag-parking" className="text-main underline underline-offset-2">
                NFC 자동 저장
              </Link>
              을 함께 보시면 됩니다.
            </>,
            <>
              <strong className="text-main">전기차를 타신다면</strong> —{" "}
              <Link href="/tips/ev-charging-time" className="text-main underline underline-offset-2">
                충전 시간과 주차 매너
              </Link>
              가 도움이 됩니다.
            </>,
            <>
              <strong className="text-main">운전을 시작한 지 얼마 안 됐다면</strong> —{" "}
              <Link href="/tips/beginner-parking-tips" className="text-main underline underline-offset-2">
                후면주차·평행주차 요령
              </Link>
              과{" "}
              <Link href="/tips/mechanical-parking-lot" className="text-main underline underline-offset-2">
                기계식 주차장 이용법
              </Link>
              을 먼저 보세요.
            </>,
          ]}
        />
      </Section>

      <Section heading="몇층은 어떤 앱인가요">
        <p>
          위 글들을 쓴 몇층(MyFloor)은 주차한 층수를 탭 두 번으로 저장하고 다시 찾는 무료 웹앱입니다.
          회원가입이 없고, 기록은 사용자 기기에만 저장되며, 가족과는 링크로 공유할 수 있습니다.
          전기차라면 충전 시간에 맞춰 알림도 받을 수 있습니다.{" "}
          <Link href="/about" className="text-main underline underline-offset-2">
            서비스 소개
          </Link>
          에서 자세히 확인하거나,{" "}
          <Link href="/" className="text-main underline underline-offset-2">
            바로 사용해 보세요
          </Link>
          .
        </p>
      </Section>
    </DocPage>
  );
}
