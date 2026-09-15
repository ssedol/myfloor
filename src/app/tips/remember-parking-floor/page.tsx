import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Bullets, Callout } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("remember-parking-floor")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <p className="text-sub text-sm leading-relaxed">
        주차 층수를 잊는 건 기억력이 나빠서가 아닙니다. 주차는 매일 반복되는 행동이라 어제의 기억과 오늘의
        기억이 겹쳐버리고(간섭), 주차하는 순간에는 이미 머릿속이 다른 생각으로 가득하기 때문입니다.
        그래서 &lsquo;더 열심히 외우자&rsquo;는 해결책이 되지 못합니다. 기억하지 않아도 되게 만들어야
        합니다.
      </p>

      <Section heading="1. 엘리베이터 버튼을 누르기 전에 기록한다">
        <p>
          가장 중요한 규칙 하나만 고르라면 이것입니다. 주차 직후가 아니라{" "}
          <strong className="text-main">엘리베이터 버튼을 누르기 직전</strong>을 기록 시점으로 정하세요.
          엘리베이터 앞은 매번 반드시 거치는 지점이고, 버튼을 누르는 행동은 이미 몸에 배어 있어서 거기에
          붙은 습관은 잘 잊히지 않습니다.
        </p>
        <p>
          &lsquo;주차하면 기록&rsquo;은 실패합니다. 주차 후 짐을 챙기고 아이를 내리고 문을 잠그는 사이에
          기록이라는 행동이 끼어들 틈이 없기 때문입니다.
        </p>
      </Section>

      <Section heading="2. 기둥 번호를 층수보다 우선한다">
        <p>
          대부분의 주차장 기둥에는 &lsquo;B3-24&rsquo;처럼 층과 구역이 함께 적혀 있습니다. 층수만 외우면
          그 넓은 한 층을 다시 훑어야 하지만, 기둥 번호까지 있으면 도착 즉시 차를 찾습니다. 외울 게
          늘어나는 게 아니라, <strong className="text-main">어차피 하나를 기록할 거라면 정보량이 많은
          쪽을 기록</strong>하는 것입니다.
        </p>
        <p>
          기둥에 번호가 없는 주차장이라면 가장 가까운 고정물(소화전, 출구 표지, 장애인 주차구역, 엘리베이터
          번호)을 대신 쓰세요.
        </p>
      </Section>

      <Section heading="3. 소리 내어 한 번 말한다">
        <p>
          눈으로만 본 정보보다 입으로 말한 정보가 더 오래 남습니다(생성 효과). 차 문을 닫으면서
          &ldquo;B3, 24번&rdquo;이라고 한 번만 소리 내어 말해 보세요. 동승자가 있으면 동승자에게
          말하는 형태가 되어 더 효과적입니다.
        </p>
      </Section>

      <Section heading="4. 사진은 &lsquo;찍는 것&rsquo;이 아니라 &lsquo;찾을 수 있게&rsquo; 찍는다">
        <p>
          기둥 번호를 사진으로 찍는 방법은 널리 쓰이지만 치명적인 약점이 있습니다. 며칠 지나면 사진첩에
          비슷한 기둥 사진이 수십 장 쌓여서, 어제 것인지 오늘 것인지 구분이 안 됩니다. 사진으로 하려면
          최소한 아래 중 하나를 지키세요.
        </p>
        <Bullets
          items={[
            "찍고 나서 바로 '즐겨찾기(하트)'를 눌러 두고, 다음에 찍을 때 이전 즐겨찾기를 해제한다.",
            "잠금화면 배경으로 지정한다. 폰을 켜는 순간 보이므로 찾으러 갈 때 확실하다.",
            "사진첩 대신 메모 앱 하나에 덮어쓰기로 저장한다. 항상 최신 한 장만 남는다.",
          ]}
        />
      </Section>

      <Section heading="5. 매번 같은 구역에 대는 규칙을 만든다">
        <p>
          가능하다면 &lsquo;우리 집은 항상 B3, 자리가 없으면 B4&rsquo;처럼 우선순위를 정해 두세요.
          선택지가 8개에서 2개로 줄면 잊어버려도 손해가 크지 않습니다. 출퇴근 시간이 일정한 분들은
          실제로 이 방법만으로 문제가 거의 해결됩니다.
        </p>
        <p>
          단점은 원하는 자리가 없을 때 몇 바퀴를 더 돌게 된다는 점입니다. 만차가 잦은 단지라면 이
          방법보다 기록하는 쪽이 낫습니다.
        </p>
      </Section>

      <Section heading="6. 가족과 같은 방식을 쓴다">
        <p>
          차 한 대를 여러 명이 쓰는 가정에서는 &lsquo;누가 마지막으로 어디에 댔는가&rsquo;가 더 큰
          문제입니다. 각자 자기 방식대로 메모하면 서로 확인할 수 없습니다. 가족이 모두 볼 수 있는 곳
          하나에 기록을 모으는 것이 핵심입니다. 단톡방에 매번 보내는 방법도 있지만 대화에 묻히기
          쉽습니다.
        </p>
      </Section>

      <Section heading="7. 기억 대신 도구에 맡긴다">
        <p>습관을 만들기 어렵다면 도구를 쓰는 편이 현실적입니다. 선택 기준은 세 가지입니다.</p>
        <Bullets
          items={[
            <>
              <strong className="text-main">지하에서 동작하는가</strong> — GPS 기반 주차 위치 기록
              기능은 지하에서는 좌표를 잡지 못합니다. 지하주차장이 목적이라면 수동 입력 방식이어야
              합니다.
            </>,
            <>
              <strong className="text-main">3초 안에 끝나는가</strong> — 앱을 열고 로그인하고 메뉴를
              찾아 들어가야 한다면 결국 안 쓰게 됩니다. 열자마자 층을 고를 수 있어야 합니다.
            </>,
            <>
              <strong className="text-main">덮어쓰기가 되는가</strong> — 기록이 쌓이면 어느 것이
              최신인지 헷갈립니다. 항상 마지막 하나만 보이는 구조가 좋습니다.
            </>,
          ]}
        />
      </Section>

      <Callout>
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        은 위 세 조건에 맞춰 만든 무료 웹앱입니다. 지하에서도 동작하고(수동 입력), 앱을 열면 바로 층
        선택 화면이 뜨며, 항상 마지막 위치 하나만 보여줍니다. 가족과는 링크 하나로 공유할 수 있고,
        NFC 태그를 붙이면{" "}
        <Link href="/tips/nfc-tag-parking" className="underline underline-offset-2 font-semibold">
          기록하는 행동 자체
        </Link>
        도 없앨 수 있습니다.
      </Callout>
    </TipPage>
  );
}
