import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Sub, Bullets, Callout, DataTable } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("blackbox-parking-mode")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <p className="text-sub text-sm leading-relaxed">
        주차 녹화는 문콕과 뺑소니의 유일한 증거입니다. 그런데 켜두면 시동이 꺼진 상태에서 차 배터리를
        계속 씁니다. 방전되면 증거도 없고 차도 안 걸립니다. 이 둘의 균형을 잡는 게 전부입니다.
      </p>

      <Section heading="먼저 — 상시전원이 연결돼 있어야 합니다">
        <p>
          시거잭(12V 소켓)에만 꽂혀 있으면 시동을 끄는 순간 전원이 끊기는 차가 대부분입니다. 이
          상태로는 주차 녹화가 아예 동작하지 않습니다. 주차 녹화를 쓰려면 둘 중 하나가 필요합니다.
        </p>
        <DataTable
          head={["방식", "설명", "특징"]}
          rows={[
            [
              "상시전원 배선",
              "실내 퓨즈박스의 상시 전원에 연결. 저전압 차단 기능이 들어간 전용 케이블 사용",
              "비용 저렴. 차 배터리를 직접 소모",
            ],
            [
              "보조배터리",
              "블랙박스 전용 리튬 배터리를 별도 설치. 주행 중 충전해 주차 중에 사용",
              "차 배터리를 건드리지 않음. 설치비가 큼",
            ],
          ]}
        />
      </Section>

      <Section heading="저전압 차단값 — 가장 중요한 설정">
        <p>
          상시전원 방식이라면 <strong className="text-main">배터리가 일정 전압 아래로 떨어지면
          블랙박스가 스스로 꺼지는</strong> 기능이 반드시 켜져 있어야 합니다. 이게 방전을 막는
          유일한 안전장치입니다.
        </p>
        <Bullets
          items={[
            "12V 승용차 기준으로 11.8V ~ 12.0V 사이에서 차단되도록 설정하는 것이 일반적입니다.",
            "값을 낮게(11.5V 등) 잡으면 녹화 시간은 길어지지만 시동이 안 걸릴 위험이 커집니다.",
            "겨울에는 같은 잔량에서도 전압이 더 낮게 나옵니다. 추운 계절에는 차단값을 0.1~0.2V 높여두는 편이 안전합니다.",
            "배터리가 2~3년 이상 됐다면 차단값을 높게 잡으세요. 오래된 배터리는 전압이 버티는 듯하다가 갑자기 주저앉습니다.",
          ]}
        />
        <Callout>
          위 수치는 12V 납산 배터리를 쓰는 일반 승용차에서 널리 쓰이는 범위입니다. 차종과 배터리
          종류(AGM 등), 블랙박스 제조사 권장값에 따라 다를 수 있으니 <strong>제품 설명서의 권장
          설정을 우선</strong>하세요.
        </Callout>
        <p>
          차단 시간 설정도 함께 보세요. &lsquo;12시간 후 종료&rsquo; 같은 옵션이 있으면, 출퇴근으로
          매일 타는 차는 12~24시간, 주말에만 타는 차는 6시간 정도로 짧게 잡는 편이 안전합니다.
        </p>
      </Section>

      <Section heading="녹화 방식 선택 — 충격 감지 vs 타임랩스">
        <Sub heading="충격 감지 (이벤트 녹화)">
          <p>
            평소에는 대기하다가 충격이 감지되면 그 전후를 저장합니다. 전력 소모가 적어 오래 버팁니다.
            단점은 <strong className="text-main">충격 없이 지나간 일은 기록되지 않는다</strong>는
            것입니다. 옆 차가 문을 살짝 대고 지나가거나, 누가 차 주변을 서성인 건 남지 않습니다.
          </p>
        </Sub>
        <Sub heading="타임랩스 (저속 촬영)">
          <p>
            초당 1~2프레임으로 계속 녹화합니다. 주차 시간 전체가 남아 누가 언제 접근했는지 볼 수
            있습니다. 대신 전력 소모가 크고 저장 공간도 빨리 찹니다.
          </p>
        </Sub>
        <p>
          <strong className="text-main">둘 다 지원하면 병행 설정을 권합니다.</strong> 평소 타임랩스로
          기록하다가 충격 시 고화질 이벤트 파일을 따로 남기는 방식입니다. 대부분의 제품이 지원합니다.
        </p>
      </Section>

      <Section heading="방전을 줄이는 현실적인 방법">
        <Bullets
          items={[
            "짧은 거리만 반복 운행하면 배터리가 충분히 충전되지 않습니다. 주 1회는 20~30분 이상 연속 주행해 주세요.",
            "장기간(1주 이상) 세워둘 때는 주차 녹화를 끄거나 블랙박스 전원을 분리하는 편이 낫습니다.",
            "점프 스타터를 트렁크에 하나 두세요. 방전됐을 때 견인차를 부르는 것보다 훨씬 빠르고 쌉니다.",
            "배터리 교체 주기는 보통 3~4년입니다. 시동 걸 때 소리가 무거워졌다면 교체 시기입니다.",
            "메모리카드는 소모품입니다. 6개월~1년마다 포맷하고, 2년쯤 지나면 교체하세요. 정작 필요할 때 파일이 깨져 있는 경우가 많습니다.",
          ]}
        />
      </Section>

      <Section heading="전기차·하이브리드는 다릅니다">
        <p>
          전기차에도 12V 보조배터리가 따로 있고, 블랙박스는 이 배터리를 씁니다. 구동용 대용량
          배터리와는 별개라 <strong className="text-main">&ldquo;전기차니까 방전 걱정
          없다&rdquo;는 틀린 말</strong>입니다. 오히려 12V 보조배터리가 방전되면 차가 아예 깨어나지
          않아 더 번거롭습니다.
        </p>
        <p>
          차종에 따라 12V 배터리를 자동으로 보충 충전하는 기능이 있기도 하고, 제조사가 블랙박스
          상시전원 연결 방식을 따로 안내하기도 합니다. 전기차라면 임의로 배선하지 말고{" "}
          <strong className="text-main">제조사 권장 방식과 보증 조건을 먼저 확인</strong>하세요.
        </p>
      </Section>

      <Callout>
        블랙박스가 Wi-Fi로 연결되는 모델이라면 주차 위치를 찾을 때도 쓸 수 있습니다. 앱 연결이 잡히는
        지점이 곧 차 근처입니다. 자세한 방법은{" "}
        <Link href="/tips/find-car-in-parking-lot" className="underline underline-offset-2 font-semibold">
          지하주차장에서 차를 못 찾을 때
        </Link>
        에 정리했습니다.
      </Callout>
    </TipPage>
  );
}
