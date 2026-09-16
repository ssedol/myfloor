import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Sub, Bullets, Callout } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("beginner-parking-tips")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <p className="text-sub text-sm leading-relaxed">
        주차가 어려운 이유는 운전 실력이 아니라 <strong className="text-main">기준점이
        없어서</strong>입니다. 베테랑도 처음 타는 차에서는 헤맵니다. 반대로 &lsquo;여기서 꺾는다&rsquo;는
        기준 하나만 몸에 익으면 초보도 한 번에 들어갑니다. 감을 익히려 하지 말고 기준점을 외우세요.
      </p>

      <Section heading="시작하기 전에 — 사이드미러부터 맞추세요">
        <p>
          주차를 못 하는 사람의 절반은 미러가 잘못 맞춰져 있습니다. 주차용 각도는 주행용과 다릅니다.
        </p>
        <Bullets
          items={[
            "평소 주행 시에는 내 차체가 미러 안쪽에 아주 살짝(1/5 정도)만 보이게 맞춥니다.",
            "후진 주차를 할 때는 미러를 아래로 더 내려 뒷바퀴와 주차선이 함께 보이게 합니다. 전동 미러 차량은 기어를 R에 넣으면 자동으로 내려가는 기능이 있는 경우가 많으니 설정에서 켜두세요.",
            "뒷바퀴가 보여야 하는 이유는, 주차의 성패가 결국 뒷바퀴가 어디를 지나는가로 결정되기 때문입니다.",
          ]}
        />
      </Section>

      <Section heading="후면주차 (직각주차) — 사이드미러 기준법">
        <Sub heading="1. 자리 옆을 지나며 간격 만들기">
          <p>
            들어갈 자리와 <strong className="text-main">내 차 옆면 사이를 약 1m</strong> 띄우고
            나란히 지나갑니다. 너무 붙으면 꺾을 공간이 없고, 너무 멀면 한 번에 안 들어옵니다. 옆 차와
            문 하나 열 정도 거리라고 생각하면 됩니다.
          </p>
        </Sub>
        <Sub heading="2. 멈추는 지점 잡기">
          <p>
            내 <strong className="text-main">어깨(운전석 B필러)가 들어갈 자리의 안쪽 주차선</strong>을
            지날 때 멈춥니다. 옆에 차가 서 있다면 그 차의 뒷범퍼가 내 어깨선에 올 때입니다.
          </p>
        </Sub>
        <Sub heading="3. 핸들을 끝까지 감고 후진">
          <p>
            들어갈 방향으로 핸들을 끝까지 감고 천천히 후진합니다. 이때{" "}
            <strong className="text-main">사이드미러로 안쪽 주차선을 봅니다.</strong> 미러 안에서
            주차선이 내 차와 나란해지기 시작하면 방향이 맞아가는 중입니다.
          </p>
        </Sub>
        <Sub heading="4. 차가 자리와 평행해지면 핸들 풀기">
          <p>
            양쪽 미러에 좌우 주차선이 비슷한 간격으로 보이면 핸들을 중립으로 풀고 똑바로 후진합니다.
            한쪽이 붙어 보이면 그쪽 반대로 살짝만 감아 보정하세요.
          </p>
        </Sub>
        <Sub heading="5. 멈추는 시점">
          <p>
            후방 카메라가 있으면 가이드선을, 없으면 옆 차의 뒷유리 라인이나 기둥 위치를 기준으로
            삼습니다. 애매하면 <strong className="text-main">한 번 내려서 보세요.</strong> 내려서
            확인하는 게 창피한 일이 아니라, 긁고 나서 후회하는 게 창피한 일입니다.
          </p>
        </Sub>
        <Callout>
          한 번에 안 들어가면 다시 나와서 처음부터 하세요. 억지로 핸들을 돌려가며 비집는 것보다
          훨씬 빠르고 안전합니다. 뒤에 차가 기다려도 서두르지 마세요. 사고 나면 훨씬 오래 걸립니다.
        </Callout>
      </Section>

      <Section heading="평행주차 — 두 번의 꺾기">
        <Bullets
          items={[
            "앞차와 나란히, 약 50~80cm 띄우고 섭니다. 내 차 뒷바퀴가 앞차 뒷범퍼와 비슷한 선에 오게 합니다.",
            "핸들을 인도 쪽으로 끝까지 감고 후진합니다. 차가 45도쯤 비스듬해질 때까지 갑니다.",
            "핸들을 중립으로 풀고 조금 더 후진합니다. 뒤차와의 간격을 미러로 확인하세요.",
            "이번엔 핸들을 반대로 끝까지 감고 후진하면 차체가 자리 안으로 들어오며 펴집니다.",
            "앞뒤로 조금씩 움직여 가운데를 맞추고, 연석과의 간격을 30cm 내외로 조정합니다.",
          ]}
        />
        <p>
          평행주차는 <strong className="text-main">내 차 길이의 1.5배</strong> 정도 공간이 있어야
          편합니다. 그보다 좁으면 여러 번 꺾어야 하니, 초보 때는 그냥 다른 자리를 찾는 편이
          낫습니다.
        </p>
      </Section>

      <Section heading="초보가 자주 놓치는 것들">
        <Bullets
          items={[
            <>
              <strong className="text-main">앞바퀴는 따라오지 않습니다.</strong> 후진할 때 차 뒤는
              생각한 대로 가는데 앞쪽이 바깥으로 크게 돕니다. 옆 차와 부딪히는 건 대부분 뒤가 아니라
              앞 펜더입니다.
            </>,
            <>
              <strong className="text-main">브레이크에 발을 올린 채 움직이세요.</strong> 주차는
              액셀을 밟는 게 아니라 브레이크를 살짝 떼며 하는 동작입니다. 자동변속기는 그것만으로
              충분히 굴러갑니다.
            </>,
            <>
              <strong className="text-main">후방 카메라만 믿지 마세요.</strong> 광각 렌즈라 거리
              감각이 실제와 다르고, 바닥의 턱이나 낮은 볼라드는 잘 안 보입니다. 미러와 함께
              쓰세요.
            </>,
            <>
              <strong className="text-main">경사에서는 반드시 사이드브레이크.</strong> P만 걸어두면
              변속기에 하중이 걸리고, 시간이 지나면 차가 살짝 밀립니다.
            </>,
          ]}
        />
      </Section>

      <Section heading="연습은 어디서">
        <p>
          주말 이른 아침의 대형마트 지하주차장이 가장 좋습니다. 차가 거의 없고, 조명이 일정하고,
          주차선 규격이 표준이라 기준점을 익히기 좋습니다. 빈 자리 하나를 정해두고 열 번 반복해
          보세요. 열 번이면 기준점이 몸에 붙습니다.
        </p>
      </Section>

      <Callout>
        연습하러 간 넓은 지하주차장에서 정작 차를 못 찾는 일이 생깁니다.{" "}
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        으로 층수를 저장해 두세요. 이미 놓쳤다면{" "}
        <Link href="/tips/find-car-in-parking-lot" className="underline underline-offset-2 font-semibold">
          차를 못 찾을 때 5분 안에 찾는 순서
        </Link>
        를 보세요.
      </Callout>
    </TipPage>
  );
}
