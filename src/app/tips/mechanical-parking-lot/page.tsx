import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Sub, Bullets, Callout, DataTable } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("mechanical-parking-lot")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <p className="text-sub text-sm leading-relaxed">
        기계식 주차장은 철판 위에 차를 올리면 기계가 알아서 자리로 옮겨 주는 설비입니다. 좁은 땅에
        많은 차를 넣을 수 있어 도심 상가와 오피스텔에 흔합니다. 문제는{" "}
        <strong className="text-main">한 번 잘못 넣으면 차가 찌그러지거나, 사람이 다칠 수
        있다</strong>는 점입니다. 들어가기 전에 확인할 것부터 보겠습니다.
      </p>

      <Section heading="진입 전에 확인할 네 가지 숫자">
        <p>
          입구에 반드시 제원 제한이 붙어 있습니다. 네 가지 중 하나라도 넘으면 들어가면 안 됩니다.
        </p>
        <DataTable
          head={["항목", "무엇인지", "넘으면"]}
          rows={[
            ["전고 (높이)", "지붕 끝까지 높이. 루프박스·안테나 포함", "천장·상부 구조물에 긁힘"],
            ["전폭 (너비)", "사이드미러 접은 상태 기준", "측면 가이드에 문짝 손상"],
            ["전장 (길이)", "범퍼 끝에서 끝", "팔레트 밖으로 나와 걸림"],
            ["중량", "탑승자·짐 제외한 공차중량 기준이 많음", "리프트 정지 또는 설비 손상"],
          ]}
        />
        <Callout>
          내 차 제원은 차량 설명서나 제조사 홈페이지 &lsquo;제원표&rsquo;에서 확인할 수 있습니다.
          한 번 메모해 두면 평생 씁니다. 특히 <strong>전고</strong>는 SUV·박스형 차량에서 가장 자주
          걸리는 항목입니다.
        </Callout>
        <p>
          주의할 점은 이 숫자가 <strong className="text-main">주차장마다 다르다</strong>는 것입니다.
          중형 기준 설비가 흔하긴 하지만, 오래된 소형 설비는 훨씬 빡빡합니다. &ldquo;저번 건물은
          됐으니까&rdquo;는 근거가 되지 않습니다. 매번 입구 표지를 보세요.
        </p>
      </Section>

      <Section heading="차를 올리는 순서">
        <Bullets
          items={[
            "팔레트(철판)가 완전히 멈춘 것을 눈으로 확인하고 진입합니다. 움직이는 중에 올리면 안 됩니다.",
            "사이드미러를 접습니다. 전동 접이가 없는 차는 손으로 접으세요. 미러 폭 때문에 긁히는 사고가 가장 흔합니다.",
            "팔레트 바닥에 그려진 유도선이나 앞바퀴 멈춤턱까지 천천히 전진합니다. 턱에 닿는 느낌이 나면 멈춥니다.",
            "기어를 P(수동은 1단 또는 후진)에 놓고 사이드브레이크를 채웁니다. 중립에 두면 안 됩니다.",
            "시동을 끄고 창문을 닫습니다. 블랙박스 상시 녹화는 꺼두는 편이 좋습니다. 장시간 주차 시 배터리 방전 위험이 있습니다.",
            "차에서 내려 팔레트 밖으로 완전히 나온 뒤 조작합니다. 사람이 설비 안에 있는 상태에서 작동시키면 절대 안 됩니다.",
          ]}
        />
      </Section>

      <Section heading="흔한 사고와 예방">
        <Sub heading="사이드미러 파손">
          <p>
            가장 흔합니다. 접었다고 생각했는데 한쪽만 접힌 경우, 또는 전동 접이가 작동 중에 다시
            펴지는 경우입니다. 내리기 전에 양쪽을 눈으로 확인하세요.
          </p>
        </Sub>
        <Sub heading="루프 안테나·루프랙 파손">
          <p>
            상어지느러미형 안테나는 대체로 괜찮지만, 막대형 안테나는 돌려서 빼두는 편이 안전합니다.
            루프박스를 달았다면 기계식 주차장은 아예 피하세요. 전고 계산이 완전히 달라집니다.
          </p>
        </Sub>
        <Sub heading="차량이 팔레트 밖으로 나온 상태에서 작동">
          <p>
            앞바퀴 멈춤턱까지 제대로 전진하지 않으면 뒷범퍼가 팔레트 밖으로 나옵니다. 이 상태로
            올라가면 범퍼가 구조물에 걸려 크게 파손됩니다. 내린 뒤 차 뒤를 한 번 돌아보세요.
          </p>
        </Sub>
        <Sub heading="출차 시 급발진 오인 사고">
          <p>
            팔레트가 내려온 뒤 바로 출발하려다 방향을 착각하는 경우가 있습니다. 시동을 걸고
            사이드브레이크를 푼 다음, <strong className="text-main">반드시 브레이크를 밟은 채로</strong>{" "}
            기어를 넣고 천천히 나오세요. 좁은 공간이라 조금만 틀어져도 벽에 닿습니다.
          </p>
        </Sub>
      </Section>

      <Section heading="사고가 났다면">
        <Bullets
          items={[
            "즉시 관리인에게 알리고 설비를 멈춥니다. 혼자 해결하려다 손상이 커지는 경우가 많습니다.",
            "손상 부위와 차량 위치, 설비 상태를 사진으로 남깁니다. 팔레트에 차가 놓인 상태 그대로 찍어두는 것이 중요합니다.",
            "기계식 주차장은 설비 관리 주체가 따로 있는 경우가 많습니다. 건물주·관리업체·설비업체 중 누가 책임 주체인지 관리인에게 확인하세요.",
            "주차장 배상책임보험 가입 여부를 물어보세요. 가입돼 있으면 그쪽으로 처리되는 경우가 있습니다.",
          ]}
        />
        <p className="text-[12px]">
          기계식 주차장의 관리인 배치 의무, 정기 검사 주기, 사고 시 책임 배분은 관련 법령과 계약에
          따라 달라지며 개정도 이어져 왔습니다. 이 글은 이용자 입장의 실무 절차만 다룹니다. 법적
          책임 판단은 보험사나 전문가에게 확인하시기 바랍니다.
        </p>
      </Section>

      <Section heading="애초에 피하는 것도 방법입니다">
        <p>
          차가 크거나, 루프박스를 달았거나, 시간 여유가 없다면 기계식 주차장은 건너뛰는 편이
          낫습니다. 입출차에 한 대당 2~3분이 걸려서 앞에 서너 대만 밀려도 10분이 사라집니다. 근처
          자주식(일반) 주차장의 요금 차이가 크지 않다면 그쪽이 시간과 마음이 편합니다.
        </p>
      </Section>

      <Callout>
        지하 자주식 주차장을 쓰신다면 층수를 잊는 문제가 따라옵니다.{" "}
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        으로 주차 직후 층을 저장해 두세요. 습관을 붙이는 방법은{" "}
        <Link href="/tips/remember-parking-floor" className="underline underline-offset-2 font-semibold">
          주차 층수를 잊지 않는 습관 7가지
        </Link>
        에 있습니다.
      </Callout>
    </TipPage>
  );
}
