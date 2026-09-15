import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Sub, Bullets, Callout, DataTable } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("ev-charging-time")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <p className="text-sub text-sm leading-relaxed">
        아파트 지하주차장에 충전기가 생기면서 가장 자주 나오는 갈등이 &ldquo;충전 다 됐는데 왜 안
        빼요&rdquo;입니다. 그런데 정작 본인 차가 몇 시에 충전이 끝나는지 정확히 아는 사람은 많지
        않습니다. 충전 시간을 어림잡는 법부터 정리해 보겠습니다.
      </p>

      <Section heading="완속과 급속의 차이">
        <p>
          충전 시간을 결정하는 건 충전기의 <strong className="text-main">출력(kW)</strong>입니다. 출력이
          2배면 시간은 대략 절반이 됩니다.
        </p>
        <DataTable
          head={["구분", "일반적인 출력", "설치 장소"]}
          rows={[
            ["완속 (AC)", "약 7kW (3.5kW 콘센트형도 있음)", "아파트 주차장, 직장, 상가 지하"],
            ["급속 (DC)", "약 50 ~ 350kW", "고속도로 휴게소, 대형마트, 전용 충전소"],
          ]}
        />
        <p>
          아파트 지하주차장에 설치된 것은 대부분 완속입니다. 급속을 설치하려면 수전 설비 증설이 필요해
          비용이 크기 때문입니다. 간혹 &lsquo;중속&rsquo;이라 불리는 11~20kW급이 들어오기도 합니다.
        </p>
      </Section>

      <Section heading="내 차는 몇 시간 걸릴까 — 계산법">
        <p>
          완속 충전은 계산이 단순합니다. 충전해야 할 전력량을 충전기 출력으로 나누면 됩니다.
        </p>
        <Callout>
          충전 시간(시간) ≈ 배터리 용량(kWh) × 충전할 비율 ÷ 충전기 출력(kW) × 1.1
        </Callout>
        <p>
          마지막 1.1은 충전 과정에서 열 등으로 빠져나가는 손실을 감안한 보정값입니다. 예를 들어 배터리
          용량 60kWh인 차를 20%에서 80%까지(=60%, 36kWh) 7kW 완속으로 충전하면,
          36 ÷ 7 × 1.1 ≈ <strong className="text-main">약 5.7시간</strong>입니다.
        </p>
        <p>
          배터리를 거의 비운 상태에서 완충까지 가면 보통 하룻밤이 꼬박 걸립니다. 그래서 완속은 &lsquo;퇴근
          후 꽂아두고 아침에 뽑는&rsquo; 패턴으로 쓰는 것이 기본입니다.
        </p>

        <Sub heading="급속은 왜 계산이 안 맞을까">
          <p>
            급속 충전은 처음부터 끝까지 최대 출력을 유지하지 않습니다. 배터리 보호를 위해 충전량이
            올라갈수록 출력을 스스로 낮추기 때문입니다(충전 커브). 그래서{" "}
            <strong className="text-main">80%까지는 빠르고, 80%에서 100%까지가 그 앞 구간만큼
            걸리는</strong> 일이 흔합니다.
          </p>
          <p>
            급속 충전소에서 100%를 채우는 것은 시간 대비 효율이 나쁘고 다음 사람을 오래 기다리게 합니다.
            일반적으로 80% 전후에서 끊는 것을 권장합니다. 겨울철에는 배터리 온도가 낮아 초반 출력이
            더 떨어지므로 예상보다 오래 걸립니다.
          </p>
        </Sub>
      </Section>

      <Section heading="충전이 끝난 뒤가 진짜 문제">
        <p>
          완속으로 밤새 충전하면 새벽 어느 시점에 충전이 끝납니다. 문제는 그 뒤로 출근 시간까지 몇
          시간 동안 충전기 자리를 차가 막고 있다는 점입니다. 충전기가 2대뿐인 단지에서는 이것만으로
          다른 세대가 아예 충전을 못 하게 됩니다.
        </p>
        <Bullets
          items={[
            "충전이 끝나는 시각을 미리 계산해 두고, 가능하면 그 시각 이후 이른 시간에 차를 뺍니다.",
            "출근이 늦은 날에는 아예 늦게 꽂아서 충전 완료 시각을 출근 시각에 맞추는 방법도 있습니다.",
            "매일 완충할 필요는 없습니다. 하루 주행거리가 40km 남짓이라면 2~3일에 한 번으로 충분합니다.",
            "충전기 앞에 내연기관차를 세우는 것은 단지 내 갈등의 가장 큰 원인입니다. 잠깐이라도 피해주세요.",
          ]}
        />
      </Section>

      <Section heading="과태료 규정은 단지·지자체별로 확인하세요">
        <p>
          한국에서는 「환경친화적 자동차의 개발 및 보급 촉진에 관한 법률」에 따라 전기차 충전구역에
          일반 차량을 주차하거나, 충전이 끝난 뒤 정해진 시간을 넘겨 계속 주차하는 행위(충전 방해 행위)에
          과태료가 부과될 수 있습니다.
        </p>
        <p>
          다만 <strong className="text-main">단속 대상이 되는 시설의 범위, 허용되는 주차 시간, 과태료
          금액은 법령 개정과 지자체 조례에 따라 달라져 왔습니다.</strong> 특히 공동주택(아파트)에
          적용되는 기준은 공공시설과 다르게 운영되는 경우가 있습니다. 정확한 기준은 관리사무소 공지나
          거주 지역 지자체(시·군·구) 홈페이지에서 최신 내용을 확인하시는 편이 안전합니다. 이 글에서는
          금액과 시간을 단정해 적지 않겠습니다.
        </p>
      </Section>

      <Section heading="배터리 수명을 생각한다면">
        <Bullets
          items={[
            "일상적으로는 20~80% 구간에서 쓰는 것이 리튬이온 배터리에 유리합니다. 장거리 출발 전날에만 100%로 채우세요.",
            "급속 충전을 매일 쓰는 것보다 완속 위주가 배터리에 부담이 적습니다.",
            "완충 상태로 장기간 세워두는 것은 피하세요. 오래 주차할 때는 50~60% 정도가 적당합니다.",
            "겨울에는 충전 중에 히터 예약(사전 공조)을 걸어두면 주행 가능 거리 손실을 줄일 수 있습니다.",
          ]}
        />
        <p className="text-[12px]">
          위 권장 사항은 차종과 배터리 화학 조성(NCM, LFP 등)에 따라 다를 수 있습니다. LFP 배터리를
          쓰는 차량은 제조사가 주기적인 100% 충전을 권장하기도 하므로, 최종적으로는 차량 설명서를
          따르세요.
        </p>
      </Section>

      <Callout>
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        에는 주차 층수를 저장할 때 충전 알림을 함께 예약하는 기능이 있습니다. 완속은 13시간 후, 급속은
        45분 후에 푸시 알림이 와서 차를 빼야 할 시점을 놓치지 않게 해줍니다. 알림을 받으려면 홈 화면에
        설치가 필요합니다 —{" "}
        <Link href="/install" className="underline underline-offset-2 font-semibold">
          설치 방법 보기
        </Link>
        .
      </Callout>
    </TipPage>
  );
}
