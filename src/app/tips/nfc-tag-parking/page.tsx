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

const meta = getTip("nfc-tag-parking")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

const TOC = [
  { id: "what", label: "NFC 태그가 뭔가요" },
  { id: "buy", label: "어떤 태그를 사야 하나요" },
  { id: "write", label: "태그에 URL 기록하기" },
  { id: "os", label: "iOS와 안드로이드의 동작 차이" },
  { id: "where", label: "어디에 붙여야 하나요" },
  { id: "apartment", label: "아파트에 설치할 때 주의할 점" },
  { id: "cost", label: "비용은 얼마나 드나" },
  { id: "compare", label: "NFC · QR · 손으로 저장 비교" },
  { id: "trouble", label: "인식이 안 될 때 점검 순서" },
];

export default function Page() {
  return (
    <TipPage meta={meta} toc={TOC}>
      <KeyPoints
        items={[
          "NFC 태그는 배터리가 없는 칩으로, 안에 URL 한 줄만 저장해 두면 휴대폰을 대는 순간 층수가 기록된다.",
          "주차장 기둥에는 NTAG213 스티커면 충분하다. 금속 위라면 반드시 온메탈 태그를 쓴다.",
          "아이폰은 배너를 한 번 눌러야 하고, 안드로이드는 대는 즉시 열린다.",
          "공용부 부착은 관리사무소 협의가 필수이고, 태그는 누구나 위조할 수 있으므로 서명 검증이 있는 주소를 써야 한다.",
        ]}
      />

      <p className="text-sub text-sm leading-relaxed">
        주차 위치를 기록하는 가장 좋은 방법은 &lsquo;기록한다&rsquo;는 행동 자체를 없애는 것입니다.
        엘리베이터 앞 기둥에 붙은 스티커에 휴대폰을 가져다 대기만 하면 층수가 저장되도록 만들 수 있습니다.
        NFC 태그를 쓰면 됩니다.
      </p>

      <Section id="what" heading="NFC 태그가 뭔가요">
        <p>
          NFC(Near Field Communication) 태그는 배터리가 없는 얇은 칩입니다. 휴대폰을 가까이 대면 휴대폰이
          내보내는 전파에서 전력을 얻어 깨어나고, 안에 저장된 짧은 데이터를 휴대폰에 전달한 뒤 다시
          잠듭니다. 교통카드와 같은 원리이고, 실제로 교통카드도 NFC 태그의 일종입니다.
        </p>
        <p>
          주차 위치 기록에 쓰는 태그에는 <strong className="text-main">URL 한 줄</strong>만 저장합니다.
          예를 들어 지하 3층 기둥에 붙인 태그에는 &lsquo;이 주소를 열어라&rsquo;라는 명령과 함께 B3를
          가리키는 주소가 들어 있습니다. 휴대폰을 대면 그 주소가 열리고, 열린 페이지가 알아서 B3를
          저장합니다.
        </p>
      </Section>

      <Section id="buy" heading="어떤 태그를 사야 하나요">
        <DataTable
          head={["항목", "권장 사양"]}
          rows={[
            ["칩 종류", "NTAG213 (144바이트) — 짧은 URL에 충분"],
            ["형태", "지름 25~30mm 스티커형"],
            ["가격", "개당 수백 원 수준 (10~50개 묶음이 저렴)"],
            ["주의", "금속 표면에 붙일 경우 '온메탈(on-metal)' 태그를 선택"],
          ]}
        />
        <p>
          NTAG215나 216은 용량이 더 크지만 URL 저장 용도로는 필요 없습니다. 주차장은 습기와 먼지가
          많으므로 코팅된 제품이나 방수 에폭시 태그를 고르면 수명이 깁니다.
        </p>
        <Callout>
          주차장 기둥은 대부분 콘크리트라 일반 태그로 충분합니다. 다만 철제 기둥이나 배전반 문처럼 금속
          위에 붙이면 금속이 전파를 흡수해 인식이 거의 안 됩니다. 이때는 뒷면에 페라이트 차폐가 들어간
          온메탈 태그를 써야 합니다.
        </Callout>
      </Section>

      <Section id="write" heading="태그에 URL 기록하기">
        <Bullets
          items={[
            "안드로이드: 'NFC Tools' 같은 무료 앱을 설치 → 쓰기(Write) → 레코드 추가 → URL 선택 → 주소 입력 → 태그에 휴대폰을 대고 쓰기.",
            "아이폰: 애플의 '단축어(Shortcuts)' 앱 또는 NFC Tools iOS 버전으로 동일하게 쓸 수 있습니다.",
            "쓰기가 끝나면 반드시 '잠금(Lock)' 처리를 하세요. 잠그지 않으면 누구나 다른 주소로 덮어쓸 수 있습니다. 잠금은 되돌릴 수 없으니 주소를 먼저 확인하세요.",
            "층마다 다른 주소를 써야 하므로, B1~B8이면 8개 태그에 각각 다른 URL을 기록합니다.",
          ]}
        />
      </Section>

      <Section id="os" heading="iOS와 안드로이드의 동작 차이">
        <Sub heading="아이폰 (iPhone XS 이후, iOS 14.5+)">
          <p>
            화면이 켜져 있는 잠금 상태에서 휴대폰 <strong className="text-main">윗부분</strong>을 태그에
            대면 배너 알림이 뜨고, 그 배너를 한 번 눌러야 주소가 열립니다. 앱을 미리 켤 필요는 없지만
            &lsquo;배너 탭&rsquo;이라는 한 단계가 있습니다. 화면이 완전히 꺼져 있으면 인식되지 않으므로
            화면을 한 번 켠 뒤 대야 합니다.
          </p>
        </Sub>
        <Sub heading="안드로이드">
          <p>
            설정에서 NFC가 켜져 있으면, 화면이 켜진 상태에서 휴대폰{" "}
            <strong className="text-main">뒷면 중앙~윗부분</strong>을 대는 즉시 주소가 열립니다. 별도
            확인 절차가 없어 아이폰보다 빠릅니다. 기종별로 NFC 안테나 위치가 달라, 잘 안 되면 뒷면을
            위아래로 조금씩 옮겨가며 대보세요.
          </p>
        </Sub>
        <p className="text-[12px]">
          두 경우 모두 두꺼운 케이스나 카드 수납형 케이스(특히 교통카드가 들어 있는 경우)를 쓰면 인식이
          방해될 수 있습니다.
        </p>
      </Section>

      <Section id="where" heading="어디에 붙여야 하나요">
        <Bullets
          items={[
            "엘리베이터 홀 입구 기둥 — 반드시 지나는 지점이라 가장 효과적입니다.",
            "높이는 110~130cm — 서서 자연스럽게 폰을 댈 수 있는 높이입니다. 너무 낮으면 허리를 숙여야 해서 습관이 안 붙습니다.",
            "층수 표지판 바로 옆 — 무엇에 대한 태그인지 직관적으로 알 수 있습니다.",
            "차량 통행로 쪽이 아닌 보행 동선에 붙여야 안전합니다.",
            "'주차 층수 자동 저장' 같은 안내 스티커를 함께 붙이지 않으면 아무도 쓰지 않습니다. 태그만 있으면 그냥 스티커로 보입니다.",
          ]}
        />
      </Section>

      <Section id="apartment" heading="아파트에 설치할 때 주의할 점">
        <Bullets
          items={[
            <>
              <strong className="text-main">관리사무소 사전 협의는 필수</strong>입니다. 공용부에 무단으로
              부착물을 붙이면 철거 대상이 되고, 입주민 간 분쟁의 소지가 됩니다. 입주자대표회의 안건으로
              올리는 것이 가장 확실합니다.
            </>,
            <>
              <strong className="text-main">URL 위조 대비</strong> — 태그는 누구나 새로 만들 수 있습니다.
              악의적으로 엉뚱한 주소의 태그를 덧붙이면 주민이 다른 사이트로 유도될 수 있습니다. 층별
              주소에 서명 값을 넣어 정품 태그만 동작하게 하는 방식이 안전합니다.
            </>,
            <>
              <strong className="text-main">훼손과 분실을 전제로</strong> 여유분을 확보해 두세요. 청소
              과정에서 떼어지거나 습기로 떨어지는 일이 생깁니다.
            </>,
            <>
              <strong className="text-main">QR 코드를 함께 인쇄</strong>하면 NFC를 지원하지 않는 구형
              기기 사용자도 쓸 수 있습니다. 태그 옆에 같은 주소의 QR을 나란히 두는 구성이 가장
              무난합니다.
            </>,
          ]}
        />
      </Section>

      <Section id="cost" heading="비용은 얼마나 드나">
        <p>
          지하 1층부터 8층까지 여덟 개 층에 설치한다고 가정해 보겠습니다. 층마다 엘리베이터 홀이 두
          군데라면 태그는 16장이 필요합니다. 여기에 훼손·분실을 감안한 여유분을 더해 25장 정도를 잡으면
          넉넉합니다.
        </p>
        <DataTable
          head={["항목", "수량", "비고"]}
          rows={[
            ["NTAG213 스티커", "25장 내외", "묶음으로 사면 개당 단가가 크게 내려갑니다"],
            ["안내 스티커·아크릴 표지", "16장", "태그만 붙이면 아무도 쓰지 않습니다"],
            ["쓰기용 앱", "무료", "NFC Tools 등 무료 앱으로 충분합니다"],
            ["설치 인건비", "0원", "스티커를 붙이는 작업이라 별도 시공이 필요 없습니다"],
          ]}
        />
        <p>
          즉 실제 비용은 대부분 <strong className="text-main">안내 표지 제작비</strong>입니다. 태그 자체는
          한 단지 전체를 덮어도 부담이 큰 금액이 아닙니다. 다만 &lsquo;붙였는데 아무도 안 쓰는&rsquo;
          상황이 가장 흔한 실패이므로, 태그 값을 아끼고 안내 표지에 쓰는 편이 낫습니다.
        </p>
      </Section>

      <Section id="compare" heading="NFC · QR · 손으로 저장 비교">
        <p>
          세 방식은 대체재가 아니라 보완재에 가깝습니다. 아래 표를 보고 단지 상황에 맞게 조합하세요.
        </p>
        <DataTable
          head={["방식", "걸리는 동작", "한계"]}
          rows={[
            ["NFC 태그", "폰을 대기 (아이폰은 배너 한 번 더)", "구형 기기·미지원 기기에서는 동작 안 함"],
            ["QR 코드", "카메라 열기 → 비추기 → 배너 탭", "어두운 주차장에서 초점이 잘 안 잡힘"],
            ["손으로 저장", "앱 열기 → 층 고르기", "기억해서 직접 눌러야 함"],
          ]}
        />
        <p>
          현실적인 구성은 <strong className="text-main">태그 옆에 같은 주소의 QR을 나란히 두고, 둘 다
          안 되는 사람은 앱에서 손으로 고르게 하는 것</strong>입니다. 셋 중 하나만 고르면 반드시 못 쓰는
          사람이 생깁니다.
        </p>
      </Section>

      <Section id="trouble" heading="인식이 안 될 때 점검 순서">
        <p>
          &ldquo;태그를 댔는데 아무 일도 안 일어난다&rdquo;는 호출의 대부분은 태그 불량이 아니라 아래
          넷 중 하나입니다. 위에서부터 차례로 확인하세요.
        </p>
        <Checklist
          title="위에서부터 하나씩"
          items={[
            "화면이 꺼져 있지 않은지 — 두 운영체제 모두 화면이 켜져 있어야 인식합니다.",
            "안드로이드라면 설정에서 NFC가 켜져 있는지 — 꺼두고 쓰는 분이 의외로 많습니다.",
            "폰의 어느 부분을 대고 있는지 — 아이폰은 윗부분, 안드로이드는 뒷면 중앙~윗부분입니다.",
            "케이스에 교통카드나 금속 링이 있는지 — 카드 수납형 케이스는 인식을 크게 방해합니다.",
            "태그가 금속 위에 붙어 있는지 — 이 경우 온메탈 태그로 교체해야 합니다.",
          ]}
        />
        <p>
          여기까지 해도 안 되면 다른 휴대폰으로 같은 태그를 대보세요. 다른 폰에서 되면 휴대폰 설정 문제,
          어느 폰에서도 안 되면 태그가 훼손된 것입니다. 태그는 소모품이라고 생각하고 여유분을 두는 편이
          마음이 편합니다.
        </p>
      </Section>

      <Callout>
        <Link href="/" className="underline underline-offset-2 font-semibold">
          몇층
        </Link>
        은 NFC 태그와 QR 코드를 모두 지원합니다. 층별 주소에 서명 검증을 적용해 위조된 태그는 동작하지
        않도록 만들었습니다. 우리 아파트에 설치하고 싶다면{" "}
        <Link href="/about" className="underline underline-offset-2 font-semibold">
          서비스 소개 페이지
        </Link>
        의 문의처로 연락 주세요. 태그 없이 손으로 저장하는 기본 사용법은{" "}
        <Link href="/guide" className="underline underline-offset-2 font-semibold">
          사용 가이드
        </Link>
        에 있습니다.
      </Callout>

      <Sources
        items={[
          {
            name: "NFC Forum",
            url: "https://nfc-forum.org",
            note: "NDEF·NTAG 등 NFC 태그 규격을 정하는 국제 산업 표준화 단체",
          },
          {
            name: "한국인터넷진흥원(KISA)",
            url: "https://www.kisa.or.kr",
            note: "QR·NFC 등을 악용한 피싱 수법과 대응 요령 안내",
          },
        ]}
      />
    </TipPage>
  );
}
