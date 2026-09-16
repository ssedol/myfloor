import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Sub, Bullets, Callout } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("underground-parking-safety")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <Callout>
        이 글은 평소 대비를 위한 일반적인 안내입니다. 실제 상황에서는{" "}
        <strong>차량보다 사람이 먼저</strong>이며, 관리사무소 안내와 소방 당국의 지시를 최우선으로
        따르세요.
      </Callout>

      <p className="text-sub text-sm leading-relaxed">
        지하주차장은 물과 연기가 빠져나갈 곳이 없는 구조입니다. 지상이라면 대수롭지 않은 일이
        지하에서는 순식간에 커집니다. 미리 정해둘 게 두 가지 있습니다.{" "}
        <strong className="text-main">언제 차를 뺄 것인가</strong>와{" "}
        <strong className="text-main">어디로 대피할 것인가</strong>입니다.
      </p>

      <Section heading="침수 — 판단은 물이 차기 전에 끝나야 합니다">
        <Sub heading="차를 옮기는 기준을 미리 정해두세요">
          <p>
            비가 오기 시작한 뒤에 고민하면 늦습니다. 아래 중 하나라도 해당하면 옮긴다, 정도로 단순한
            규칙을 만들어 두세요.
          </p>
          <Bullets
            items={[
              "거주 지역에 호우경보가 발령됐을 때",
              "단지가 하천·저지대에 인접해 있고 호우주의보가 떴을 때",
              "관리사무소에서 차량 이동 안내방송이 나왔을 때 — 이때는 이미 늦은 편이니 즉시 움직이세요",
              "과거에 한 번이라도 주차장에 물이 들어온 적이 있는 단지라면, 기준을 한 단계 더 낮춰 잡으세요",
            ]}
          />
          <p>
            옮길 곳도 미리 정해두세요. 근처 고지대 노상 주차 구역, 지상 주차장이 있는 상가, 학교
            운동장 개방 여부 등을 평소에 알아두면 급할 때 헤매지 않습니다.
          </p>
        </Sub>

        <Sub heading="이미 물이 들어오기 시작했다면">
          <p>
            가장 중요한 원칙 하나입니다.{" "}
            <strong className="text-main">물이 차오르는 지하주차장에 차를 빼러 들어가지
            마세요.</strong>
          </p>
          <Bullets
            items={[
              "지하주차장은 램프를 타고 물이 한꺼번에 쏟아져 들어오며, 수위가 올라가는 속도가 예상보다 훨씬 빠릅니다.",
              "물이 차면 수압 때문에 차문이 열리지 않고, 전기 계통이 죽으면 창문도 내려가지 않습니다.",
              "차는 보험으로 보상받을 수 있습니다. 자기차량손해 담보에 가입돼 있으면 침수 피해가 보상되는 것이 일반적입니다. 가입 여부와 보상 범위는 본인 증권과 보험사에 확인하세요.",
              "이미 지하에 있다가 물이 들어오는 걸 발견했다면 차를 두고 즉시 계단으로 올라가세요. 엘리베이터는 타지 않습니다.",
            ]}
          />
        </Sub>

        <Sub heading="침수된 차는 시동을 걸지 마세요">
          <p>
            물이 빠진 뒤에도 마찬가지입니다. 엔진이나 전기 계통에 물이 들어간 상태에서 시동을 걸면
            손상이 훨씬 커집니다. 견인해서 정비소로 보내고, 보험사에 먼저 연락해 현장 사진을
            남기세요. 전기차·하이브리드는 고전압 부품이 있어 임의로 손대지 말고 제조사 긴급출동을
            부르는 것이 안전합니다.
          </p>
        </Sub>
      </Section>

      <Section heading="화재 — 지하에서는 연기가 더 위험합니다">
        <Sub heading="대피가 우선입니다">
          <p>
            지하주차장 화재에서 인명 피해는 대부분 불이 아니라 연기 때문에 생깁니다. 밀폐된 공간이라
            연기가 빠르게 차고, 시야가 사라지면 출구를 못 찾습니다.
          </p>
          <Bullets
            items={[
              "차를 빼려 하지 마세요. 진입로가 막히면 안에 갇힙니다.",
              "몸을 낮추고 벽을 한 손으로 짚으며 이동하세요. 연기 속에서는 벽이 유일한 방향 기준입니다.",
              "엘리베이터는 절대 타지 않습니다. 계단으로 지상까지 올라가세요.",
              "옷이나 수건으로 입과 코를 막고, 가능하면 물에 적시세요.",
            ]}
          />
        </Sub>
        <Sub heading="평소에 알아둘 것">
          <p>
            내가 주로 대는 자리에서 <strong className="text-main">가장 가까운 비상계단이 어느
            쪽인지</strong> 한 번만 확인해 두세요. 평소에는 늘 엘리베이터만 타기 때문에, 정작 급할 때
            계단 위치를 모르는 경우가 대부분입니다.
          </p>
          <p>
            차량용 소화기를 두는 것도 도움이 됩니다. 다만 소화기로 끌 수 있는 건 초기 단계뿐입니다.
            불길이 이미 커졌다면 끄려 하지 말고 대피하면서 신고하세요.
          </p>
        </Sub>
      </Section>

      <Section heading="평소에 해둘 수 있는 것">
        <Bullets
          items={[
            "자동차보험에 자기차량손해 담보가 들어 있는지 확인해 두세요. 침수 보상의 전제가 됩니다.",
            "관리사무소 연락처를 휴대폰에 저장해 두세요. 급할 때 검색할 시간이 없습니다.",
            "단지 내에서 가장 낮은 층이 어디인지 알아두세요. 물은 언제나 가장 아래부터 찹니다.",
            "장마철에는 가능하면 낮은 층을 피해 주차하세요. B5보다 B1이 안전합니다.",
            "차 안에 차량 등록증 사본과 보험사 연락처를 두면 사고 후 처리가 빨라집니다.",
          ]}
        />
      </Section>

      <Callout>
        장마철에 위층으로 옮겨 대면 평소와 다른 층이라 차를 못 찾기 쉽습니다.{" "}
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        으로 그때그때 층수를 저장해 두세요. 가족에게 링크로 공유해 두면 급한 상황에서 누구든 차를
        찾을 수 있습니다.
      </Callout>
    </TipPage>
  );
}
