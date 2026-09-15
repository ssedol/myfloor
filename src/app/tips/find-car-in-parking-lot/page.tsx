import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Sub, Bullets, Callout } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("find-car-in-parking-lot")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <p className="text-sub text-sm leading-relaxed">
        지하주차장에서 차를 잃어버렸을 때 가장 나쁜 선택은 무작정 걷는 것입니다. B1부터 B8까지 한 층씩
        훑으면 30분이 넘게 걸리고, 이미 지나온 구역을 다시 걷게 됩니다. 아래 순서대로 하면 대부분 5분
        안에 끝납니다.
      </p>

      <Section heading="1단계 — 층부터 좁힌다 (걷기 전에)">
        <p>
          가장 먼저 할 일은 &lsquo;후보 층 개수를 줄이는 것&rsquo;입니다. 걷기 시작하면 판단력이 흐려지므로
          엘리베이터 앞에 선 채로 아래를 떠올려 보세요.
        </p>
        <Bullets
          items={[
            <>
              <strong className="text-main">주차하고 몇 층을 올라왔는지</strong> — 엘리베이터에서 누른
              버튼이 아니라, 문이 닫힐 때 표시되던 숫자를 기억하는 편이 정확합니다.
            </>,
            <>
              <strong className="text-main">램프를 몇 번 돌았는지</strong> — 지하주차장은 보통 한 층당
              반 바퀴에서 한 바퀴를 돕니다. 진입 후 두 번 돌았다면 B2 근처일 확률이 높습니다.
            </>,
            <>
              <strong className="text-main">주차한 시간대</strong> — 오후 6~9시에 귀가했다면 상층부(B1~B2)는
              이미 만차였을 가능성이 큽니다. 늦게 들어왔을수록 더 깊은 층입니다.
            </>,
            <>
              <strong className="text-main">어느 동 엘리베이터를 탔는지</strong> — 대개 자기 동에서 가장
              가까운 자리에 세우므로, 그 동 주변부터 확인합니다.
            </>,
          ]}
        />
        <p>
          이 네 가지만으로도 후보가 8개 층에서 2~3개 층으로 줄어듭니다. 확신이 서는 층 하나를 먼저
          정하세요.
        </p>
      </Section>

      <Section heading="2단계 — 스마트키를 제대로 쓴다">
        <p>
          스마트키의 도달 거리는 개활지에서 20~50m 정도지만, 콘크리트 기둥과 차체가 빽빽한 지하주차장에서는
          체감상 10~20m로 줄어듭니다. 그래서 &ldquo;눌러봤는데 안 되네&rdquo;는 대부분 거리 문제입니다.
        </p>
        <Bullets
          items={[
            "잠금 버튼 대신 비상등(패닉) 버튼을 쓰면 소리와 빛이 훨씬 오래 지속되어 찾기 쉽습니다.",
            "키를 턱 밑이나 머리 옆에 붙이고 누르면 도달 거리가 조금 늘어납니다. 신체의 수분이 안테나 역할을 한다고 알려져 있습니다.",
            "한 자리에서 계속 누르지 말고, 20m쯤 걸어간 뒤 다시 누르는 식으로 이동하며 반복하세요.",
            "주차장 내 기둥 사이 통로(주행로) 한가운데에서 누르는 편이 차 사이에 끼어서 누르는 것보다 잘 닿습니다.",
          ]}
        />
      </Section>

      <Section heading="3단계 — 휴대폰에 남은 흔적을 뒤진다">
        <p>지하에서는 GPS가 잡히지 않지만, 아래 기록들은 의외로 단서를 남깁니다.</p>
        <Bullets
          items={[
            <>
              <strong className="text-main">블랙박스 앱</strong> — 상시 녹화 중인 블랙박스가 Wi-Fi로
              연결되는 모델이라면, 앱을 열었을 때 연결이 잡히는 위치가 곧 차 근처입니다. 연결/해제가
              반복되는 지점을 따라가면 됩니다.
            </>,
            <>
              <strong className="text-main">차량 제조사 앱</strong> — 현대 블루링크, 기아 커넥트, 테슬라
              앱 등은 마지막 주차 위치를 기록합니다. 지하라 좌표가 부정확할 수 있지만 &lsquo;어느 동
              근처&rsquo;까지는 알려줍니다. 원격 경적·비상등 기능이 있다면 그것이 가장 확실합니다.
            </>,
            <>
              <strong className="text-main">걸음 수 기록</strong> — 건강 앱의 오늘 걸음 수 그래프에서
              주차 직후 시간대를 보면, 차에서 엘리베이터까지 몇 걸음이었는지 대략 나옵니다. 50걸음이면
              엘리베이터 바로 앞, 200걸음이면 꽤 멀리 댄 것입니다.
            </>,
            <>
              <strong className="text-main">사진첩</strong> — 무의식적으로 기둥 번호를 찍어둔 적이 없는지
              확인해 보세요. 사진의 촬영 시각이 주차 시각과 맞으면 그게 답입니다.
            </>,
          ]}
        />
      </Section>

      <Section heading="4단계 — 그래도 못 찾으면 관리사무소">
        <p>
          대부분의 아파트와 대형 건물 주차장에는 차량번호 인식 카메라(LPR)가 입출차 지점에 설치되어
          있습니다. 관리사무소에 차량번호를 말하면 <strong className="text-main">입차 시각</strong>을
          확인해 줄 수 있고, 일부 단지는 층별 카메라 영상으로 진입한 층까지 특정해 줍니다.
        </p>
        <p>
          다만 개인정보 보호 문제로 영상 열람은 차주 본인 확인을 거쳐야 하고, 야간에는 당직자만 있어
          제한될 수 있습니다. 신분증과 차량 등록증을 준비해 가면 절차가 빠릅니다.
        </p>
      </Section>

      <Section heading="한 층을 훑을 때의 요령">
        <Sub heading="지그재그가 아니라 한 방향으로">
          <p>
            통로를 왔다 갔다 하면 반드시 빠뜨리는 구역이 생깁니다. 한쪽 끝에서 시작해 통로를 따라
            끝까지 간 뒤, 옆 통로로 넘어와 되돌아오는 식으로 &lsquo;ㄹ&rsquo; 자를 그리며 이동하세요.
          </p>
        </Sub>
        <Sub heading="차 전체가 아니라 특징 하나만 본다">
          <p>
            차종과 색을 동시에 보려 하면 뇌가 느려집니다. &lsquo;흰색&rsquo; 하나만 보고 걷다가 흰 차가
            보일 때만 번호판을 확인하는 편이 훨씬 빠릅니다.
          </p>
        </Sub>
        <Sub heading="기둥 번호를 기준으로 끊는다">
          <p>
            기둥마다 &lsquo;B3-24&rsquo; 같은 번호가 붙어 있습니다. 앞 숫자는 층, 뒤 숫자는 구역입니다.
            &lsquo;20번대까지는 봤다&rsquo;라고 끊어서 기억하면 같은 곳을 두 번 걷지 않습니다.
          </p>
        </Sub>
      </Section>

      <Callout>
        다음부터 이 상황을 만들지 않는 가장 확실한 방법은, 주차하고 엘리베이터 버튼을 누르기 전에 층수를
        기록하는 것입니다.{" "}
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        은 그 과정을 탭 두 번으로 줄이기 위해 만든 무료 웹앱입니다. 습관을 만드는 다른 방법은{" "}
        <Link href="/tips/remember-parking-floor" className="underline underline-offset-2 font-semibold">
          주차 층수를 잊지 않는 습관 7가지
        </Link>
        에 정리해 두었습니다.
      </Callout>
    </TipPage>
  );
}
