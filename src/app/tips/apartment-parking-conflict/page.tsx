import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Sub, Bullets, Callout } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("apartment-parking-conflict")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <p className="text-sub text-sm leading-relaxed">
        아파트 주차 분쟁의 본질은 주차 자리가 아니라 &lsquo;무시당했다는 기분&rsquo;입니다. 같은
        상황이라도 쪽지 한 줄을 어떻게 쓰느냐에 따라 조용히 끝나기도 하고 몇 달을 끄는 감정 싸움이
        되기도 합니다. 자주 생기는 세 가지를 순서대로 보겠습니다.
      </p>

      <Section heading="1. 이중주차로 차가 막혔을 때">
        <Sub heading="먼저 밀어보기 전에 확인할 것">
          <p>
            이중주차한 차는 원칙적으로 기어를 중립(N)에 두고 사이드브레이크를 풀어 둡니다. 밀리는
            차라면 밀어서 빼는 것이 가장 빠릅니다. 다만 밀기 전에 두 가지를 보세요.
          </p>
          <Bullets
            items={[
              "경사입니다. 지하주차장은 배수를 위해 미세한 기울기가 있는 곳이 많습니다. 내리막 쪽으로 밀면 멈추기 어렵습니다. 혼자 밀 수 있을 것 같아도 경사가 보이면 하지 마세요.",
              "전기차·하이브리드는 기어가 중립이어도 전자식 파킹브레이크가 걸려 있어 밀리지 않는 경우가 많습니다. 억지로 밀면 구동계에 무리가 갑니다.",
              "밀어서 옮긴 뒤 그 차가 다른 차를 막게 되지는 않는지 확인하세요. 분쟁이 한 단계 번집니다.",
            ]}
          />
        </Sub>

        <Sub heading="연락처가 없을 때">
          <p>
            차주 연락처를 못 찾으면 관리사무소에 차량번호를 알리는 것이 가장 빠릅니다. 대부분의
            단지는 입주민 차량 등록 정보를 가지고 있어 안내방송이나 전화 연결이 됩니다. 경비실에
            직접 가는 것보다 관리사무소가 정확합니다.
          </p>
          <p>
            차 유리에 붙은 번호로 전화할 때는 &ldquo;차 빼주세요&rdquo;보다{" "}
            <strong className="text-main">&ldquo;OO동 주민인데 B3에서 차가 막혀서요&rdquo;</strong>
            처럼 상황을 먼저 말하는 편이 반응이 빠릅니다. 상대는 자다 깬 상태일 수도 있습니다.
          </p>
        </Sub>

        <Callout>
          가족 중 누가 차를 세웠는지 몰라 연락이 늦어지는 경우도 많습니다. 주차 위치를 가족이 함께
          볼 수 있게 해두면 이런 상황에서 시간을 크게 아낄 수 있습니다.
        </Callout>
      </Section>

      <Section heading="2. 옆 차가 선을 넘어 세웠을 때">
        <p>
          선을 넘은 차 옆에 억지로 대면 내 차 문도 못 열고, 결국 내가 문콕의 가해자가 됩니다. 자리가
          있다면 <strong className="text-main">그냥 다른 자리에 대는 것이 가장 이득</strong>입니다.
          한 번 참는 비용보다 분쟁 비용이 훨씬 큽니다.
        </p>
        <p>
          그래도 남길 말이 있다면 쪽지의 톤이 전부를 결정합니다. 아래 두 문장의 결과는 완전히
          다릅니다.
        </p>
        <Bullets
          items={[
            <>
              <span className="line-through opacity-60">주차 똑바로 합시다. 기본이 안 됐네요.</span>{" "}
              → 상대는 사과 대신 반격을 준비합니다.
            </>,
            <>
              <strong className="text-main">
                선이 조금 넘어와서 문 열기가 어려웠어요. 다음엔 조금만 안쪽으로 부탁드립니다.
              </strong>{" "}
              → 대부분 다음부터 조심합니다.
            </>,
          ]}
        />
        <p>
          쪽지는 와이퍼에 끼우기보다 운전석 창문 쪽 유리에 붙이는 편이 낫습니다. 와이퍼에 끼운 종이는
          비에 젖어 도장을 얼룩지게 만들고, 그 자체가 새로운 항의 거리가 됩니다.
        </p>
      </Section>

      <Section heading="3. 문콕을 당했을 때 / 했을 때">
        <Sub heading="당했을 때">
          <p>
            상대 차가 이미 떠난 뒤 발견하는 경우가 대부분입니다. 순서는 이렇습니다.
          </p>
          <Bullets
            items={[
              "먼저 사진을 찍습니다. 손상 부위 근접 사진, 차 전체가 나오는 사진, 주변 기둥 번호가 함께 나오는 사진 세 장이면 충분합니다.",
              "블랙박스 주차 녹화를 확인합니다. 충격 감지 모드가 있으면 해당 시각 파일부터 보세요.",
              "관리사무소에 CCTV 확인을 요청합니다. 개인정보 문제로 본인이 직접 열람하지 못하고 직원 입회하에 확인하는 경우가 많습니다. 차량 등록증과 신분증을 챙겨 가면 빠릅니다.",
              "수리비가 소액이고 상대를 특정하지 못했다면, 자차보험 처리 시 할증을 따져보고 결정하세요. 수리비보다 할증이 더 나오는 경우가 흔합니다.",
            ]}
          />
        </Sub>
        <Sub heading="했을 때">
          <p>
            내가 냈다면 그냥 연락처를 남기는 것이 가장 싸게 끝나는 길입니다. 흠집 하나는 보통
            도장 부분 수리로 끝나지만, 뺑소니로 몰려 CCTV까지 돌아가면 금액과 감정이 함께 커집니다.
          </p>
        </Sub>
        <p className="text-[12px]">
          주차장 내 사고의 법적 처리 기준은 여러 차례 개정되어 왔고, 단지 형태와 상황에 따라 적용이
          달라집니다. 이 글은 실무적인 대처 순서만 다루며, 책임 소재나 처벌 여부는 보험사와 경찰에
          확인하시기 바랍니다.
        </p>
      </Section>

      <Section heading="분쟁을 줄이는 구조적인 방법">
        <Bullets
          items={[
            "가능하면 기둥 옆자리를 고르세요. 한쪽이 벽이나 기둥이면 문콕 위험이 절반으로 줄고, 차를 찾기도 쉽습니다.",
            "넓은 자리가 없을 때는 조금 걷더라도 한산한 쪽 끝으로 가세요. 출입구 근처 경쟁이 분쟁의 대부분입니다.",
            "이중주차를 할 수밖에 없다면 반드시 중립에 놓고, 연락처를 잘 보이는 위치에 두세요. 대시보드 안쪽 깊숙이 둔 번호는 밖에서 안 보입니다.",
            "같은 자리를 계속 쓰는 이웃과는 눈인사라도 트는 편이 좋습니다. 아는 사람에게는 쪽지 대신 말로 하게 되고, 말로 하면 대부분 그 자리에서 끝납니다.",
          ]}
        />
      </Section>

      <Callout>
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        으로 주차 위치를 저장해 두면 가족에게 링크 하나로 공유할 수 있습니다. &lsquo;누가 어디에
        세웠는지&rsquo; 몰라서 연락이 늦어지는 상황을 줄일 수 있습니다. 차를 찾지 못해 헤맬 때의
        대처는{" "}
        <Link href="/tips/find-car-in-parking-lot" className="underline underline-offset-2 font-semibold">
          지하주차장에서 차를 못 찾을 때
        </Link>
        에 정리해 두었습니다.
      </Callout>
    </TipPage>
  );
}
