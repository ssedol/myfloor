import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import {
  Section,
  Sub,
  Bullets,
  Callout,
  DataTable,
  KeyPoints,
  Checklist,
  Sources,
} from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("parking-damage-prevention")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

const TOC = [
  { id: "good", label: "좋은 자리의 조건" },
  { id: "bad", label: "피해야 할 자리" },
  { id: "score", label: "자리별 위험도 한눈에 보기" },
  { id: "after-park", label: "댄 다음에 할 것" },
  { id: "inside", label: "차 안에 두지 말 것" },
  { id: "damaged", label: "그래도 당했다면 — 수리와 보험 판단" },
  { id: "longterm", label: "며칠 이상 세워둔다면" },
];

export default function Page() {
  return (
    <TipPage meta={meta} toc={TOC}>
      <KeyPoints
        items={[
          "손상의 대부분은 운이 아니라 자리를 고르는 30초에 결정된다.",
          "한쪽이 기둥이나 벽인 자리는 문콕 확률이 그대로 절반이 된다.",
          "카트 보관소 주변과 램프 출구 옆은 주차장에서 가장 위험한 두 구역이다.",
          "소액 문콕은 자차 처리보다 자비 수리가 유리한 경우가 많다. 할증을 먼저 따져본다.",
        ]}
      />

      <p className="text-sub text-sm leading-relaxed">
        주차장에서 차가 상하는 일의 대부분은 운이 아니라 자리 선택의 결과입니다. 같은 주차장이라도
        어디에 대느냐에 따라 문콕을 당할 확률이 몇 배씩 차이 납니다. 30초만 더 고민하면 수십만 원을
        아낍니다.
      </p>

      <Section id="good" heading="좋은 자리의 조건">
        <Sub heading="한쪽이 막혀 있는 자리">
          <p>
            기둥 옆, 벽 끝, 통로 맨 끝자리는 한쪽에 차가 없습니다.{" "}
            <strong className="text-main">문콕 위험이 그대로 절반</strong>이 되고, 나중에 차를 찾기도
            쉽습니다. 기둥 쪽으로 좁게 들어가야 하는 불편은 있지만, 대는 건 내가 조심하면 되는
            일이고 옆 차가 여는 문은 내가 통제할 수 없습니다.
          </p>
        </Sub>

        <Sub heading="이미 반듯하게 주차된 차 옆">
          <p>
            옆 차가 선 안에 정확히 들어와 있다면 그 차주는 조심하는 사람일 가능성이 높습니다. 반대로
            비뚤게 걸쳐 있거나 이미 흠집투성이인 차 옆은 피하세요. 주차 습관은 잘 바뀌지 않습니다.
          </p>
        </Sub>

        <Sub heading="사람 통행이 적은 쪽">
          <p>
            엘리베이터·출입구 바로 앞은 가장 편하지만 그만큼 차량 회전율과 보행자 통행이 많습니다.
            카트가 굴러오고, 아이가 뛰어다니고, 문을 급하게 엽니다. 30초 더 걷는 대신 한산한
            구역으로 가는 편이 이득입니다.
          </p>
        </Sub>
      </Section>

      <Section id="bad" heading="피해야 할 자리">
        <Bullets
          items={[
            <>
              <strong className="text-main">쇼핑카트 보관소 주변</strong> — 바람이나 경사에 카트가
              굴러가 차를 긁는 사고가 잦습니다. 주차장 안에서 가장 위험한 구역 중 하나입니다.
            </>,
            <>
              <strong className="text-main">램프 출구 바로 옆</strong> — 내려오는 차가 회전하며
              시야가 좁아지는 지점입니다. 접촉 사고가 몰립니다.
            </>,
            <>
              <strong className="text-main">배관·스프링클러 바로 아래</strong> — 지하주차장 천장의
              배관에서 결로수나 녹물이 떨어져 도장에 얼룩이 남습니다. 오래 세워둘수록 지워지기
              어렵습니다.
            </>,
            <>
              <strong className="text-main">환풍구·배기구 앞</strong> — 매연과 먼지가 집중적으로
              쌓입니다.
            </>,
            <>
              <strong className="text-main">장애인·경차 전용구역</strong> — 해당 차량이 아니라면
              절대 대지 마세요. 과태료 문제 이전에 꼭 필요한 사람이 못 쓰게 됩니다. 기준과 금액은
              지자체마다 다르니 단지 공지를 확인하세요.
            </>,
            <>
              <strong className="text-main">나무 아래 (지상 주차 시)</strong> — 수액, 새 배설물,
              떨어지는 열매가 도장을 상하게 합니다. 특히 수액은 굳으면 잘 안 지워집니다.
            </>,
          ]}
        />
      </Section>

      <Section id="score" heading="자리별 위험도 한눈에 보기">
        <p>
          같은 주차장 안에서도 자리마다 위험의 종류가 다릅니다. 무엇을 피하고 싶은지에 따라 우선순위가
          달라지므로, 아래 표에서 본인 상황에 맞는 줄을 보세요.
        </p>
        <DataTable
          head={["자리", "문콕", "접촉", "오염", "차 찾기"]}
          rows={[
            ["기둥·벽 옆", "낮음", "보통", "낮음", "쉬움"],
            ["통로 맨 끝", "낮음", "낮음", "낮음", "쉬움"],
            ["엘리베이터 앞", "높음", "높음", "보통", "쉬움"],
            ["램프 출구 옆", "보통", "높음", "보통", "보통"],
            ["카트 보관소 주변", "높음", "높음", "보통", "쉬움"],
            ["천장 배관 아래", "보통", "보통", "높음", "보통"],
            ["한산한 구역 안쪽", "낮음", "낮음", "낮음", "어려움"],
          ]}
        />
        <p>
          표를 보면 가장 안전한 자리는 대체로 <strong className="text-main">차를 찾기 어려운
          자리</strong>라는 점이 드러납니다. 좋은 자리를 고르는 일과 차를 잃어버리는 일은 사실상 같은
          문제의 앞뒷면입니다. 위치를 기록해 두면 이 맞교환 자체가 사라집니다.
        </p>
        <Checklist
          title="대기 전 30초 점검"
          items={[
            "한쪽이 막힌 자리가 근처에 있는가",
            "옆 차가 선 안에 반듯하게 들어와 있는가",
            "머리 위에 배관이나 스프링클러가 지나가는가",
            "카트 보관소나 램프 출구에서 충분히 떨어져 있는가",
          ]}
        />
      </Section>

      <Section id="after-park" heading="댄 다음에 할 것">
        <Bullets
          items={[
            "사이드미러를 접습니다. 좁은 자리에서 미러는 가장 튀어나온 부위이고, 가장 자주 부딪힙니다. 전동 접이가 없으면 손으로 접으세요.",
            "선 안에 제대로 들어왔는지 내려서 한 번 봅니다. 한쪽으로 치우쳐 있으면 옆 사람이 좁게 쓰게 되고, 그게 문콕으로 돌아옵니다.",
            "경사가 있으면 사이드브레이크를 확실히 채웁니다. P만 걸어두면 시간이 지나며 차가 조금씩 밀립니다.",
            "문을 열 때는 손이 아니라 몸으로 각도를 제어하세요. 바람 부는 날 지상 주차장에서 문이 확 열려 옆 차를 치는 일이 흔합니다.",
          ]}
        />
      </Section>

      <Section id="inside" heading="차 안에 두지 말 것">
        <p>
          지하주차장 차량털이는 대부분 <strong className="text-main">밖에서 보이는 물건</strong>을
          노립니다. 유리를 깨는 비용보다 얻을 게 많아 보일 때 실행합니다.
        </p>
        <Bullets
          items={[
            "가방과 쇼핑백 — 안이 비어 있어도 밖에서는 알 수 없습니다. 트렁크에 넣으세요.",
            "노트북, 태블릿, 카메라 — 가장 흔한 표적입니다.",
            "동전, 지폐, 하이패스 카드 — 소액이라도 유리값이 더 나갑니다.",
            "차량 등록증과 보험증 — 도난 시 명의 도용에 쓰일 수 있습니다. 사본만 두거나 휴대폰에 촬영해 두세요.",
            "여름철 라이터, 보조배터리, 탄산음료 — 도난과 별개로 고온에서 위험합니다.",
          ]}
        />
        <Callout>
          트렁크에 넣을 때는 <strong>주차한 뒤가 아니라 출발 전</strong>에 넣으세요. 주차장에서
          트렁크에 물건을 옮기는 모습 자체가 표적이 됩니다.
        </Callout>
      </Section>

      <Section id="damaged" heading="그래도 당했다면 — 수리와 보험 판단">
        <p>
          아무리 조심해도 당하는 날이 옵니다. 이때 가장 흔한 실수는 화가 난 상태에서 곧바로 보험사에
          접수하는 것입니다. 소액 손상은 자차보험으로 처리하면 수리비보다 이후 몇 년간의 할증이 더 큰
          경우가 많습니다. 순서대로 판단하세요.
        </p>
        <Bullets
          items={[
            <>
              <strong className="text-main">1. 증거부터 남긴다</strong> — 손상 부위 근접, 차 전체,
              기둥 번호가 함께 나온 사진 세 장. 발견 시각도 함께 적어 둡니다.
            </>,
            <>
              <strong className="text-main">2. 상대를 특정할 수 있는지 본다</strong> — 블랙박스 주차
              녹화와 관리사무소 CCTV. 상대가 특정되면 상대 보험으로 처리되므로 내 할증과 무관합니다.
            </>,
            <>
              <strong className="text-main">3. 수리 견적을 먼저 받는다</strong> — 도장 부분 수리로
              끝나는지, 패널 교체까지 가는지에 따라 금액 차이가 큽니다. 견적 없이 접수하지 마세요.
            </>,
            <>
              <strong className="text-main">4. 자기부담금과 할증을 따진다</strong> — 견적이 자기부담금
              언저리라면 자차 처리의 실익이 거의 없습니다. 보험사에 &lsquo;이 금액으로 처리하면 갱신
              보험료가 얼마나 오르는지&rsquo;를 먼저 물어보세요. 접수 전에는 취소가 가능합니다.
            </>,
          ]}
        />
        <p className="text-[12px]">
          할증 기준과 자기부담금은 보험사·상품·가입 조건에 따라 다릅니다. 이 글은 판단 순서만 다루며,
          실제 금액은 본인 보험사에 확인하시기 바랍니다.
        </p>
      </Section>

      <Section id="longterm" heading="며칠 이상 세워둔다면">
        <Bullets
          items={[
            "블랙박스 주차 녹화를 켜두되 배터리 방전에 대비하세요. 설정 기준은 따로 정리해 두었습니다.",
            "장기 주차는 지상보다 지하가 유리합니다. 자외선·우박·낙하물이 없습니다.",
            "타이어 공기압을 조금 높여두면 한 지점에 눌려 생기는 변형을 줄일 수 있습니다.",
            "출발 전에 차 주변과 바닥을 한 바퀴 보세요. 바닥에 액체 자국이 있으면 누유일 수 있습니다.",
          ]}
        />
      </Section>

      <Callout>
        한산한 구역이나 끝자리에 대면 안전한 대신 차를 찾기가 어려워집니다.{" "}
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        으로 층수를 저장해 두면 그 부담이 사라져서, 좋은 자리를 마음 편히 고를 수 있습니다. 블랙박스
        주차 녹화를 방전 없이 쓰는 방법은{" "}
        <Link href="/tips/blackbox-parking-mode" className="underline underline-offset-2 font-semibold">
          따로 정리해 두었습니다
        </Link>
        .
      </Callout>

      <Sources
        items={[
          {
            name: "금융감독원",
            url: "https://www.fss.or.kr",
            note: "자동차보험 할증과 자기부담금 구조에 대한 소비자 안내",
          },
          {
            name: "경찰청",
            url: "https://www.police.go.kr",
            note: "주차장 내 물피도주(주차 뺑소니) 신고 절차 안내",
          },
        ]}
      />
    </TipPage>
  );
}
