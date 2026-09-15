import type { Metadata } from "next";
import Link from "next/link";
import TipPage from "@/components/TipPage";
import { Section, Sub, Bullets, Callout, DataTable } from "@/components/DocPage";
import { getTip } from "@/content/tips";

const meta = getTip("nfc-tag-parking")!;

export const metadata: Metadata = {
  title: `${meta.title} | 몇층`,
  description: meta.description,
  alternates: { canonical: `/tips/${meta.slug}` },
};

export default function Page() {
  return (
    <TipPage meta={meta}>
      <p className="text-sub text-sm leading-relaxed">
        주차 위치를 기록하는 가장 좋은 방법은 &lsquo;기록한다&rsquo;는 행동 자체를 없애는 것입니다.
        엘리베이터 앞 기둥에 붙은 스티커에 휴대폰을 가져다 대기만 하면 층수가 저장되도록 만들 수 있습니다.
        NFC 태그를 쓰면 됩니다.
      </p>

      <Section heading="NFC 태그가 뭔가요">
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

      <Section heading="어떤 태그를 사야 하나요">
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

      <Section heading="태그에 URL 기록하기">
        <Bullets
          items={[
            "안드로이드: 'NFC Tools' 같은 무료 앱을 설치 → 쓰기(Write) → 레코드 추가 → URL 선택 → 주소 입력 → 태그에 휴대폰을 대고 쓰기.",
            "아이폰: 애플의 '단축어(Shortcuts)' 앱 또는 NFC Tools iOS 버전으로 동일하게 쓸 수 있습니다.",
            "쓰기가 끝나면 반드시 '잠금(Lock)' 처리를 하세요. 잠그지 않으면 누구나 다른 주소로 덮어쓸 수 있습니다. 잠금은 되돌릴 수 없으니 주소를 먼저 확인하세요.",
            "층마다 다른 주소를 써야 하므로, B1~B8이면 8개 태그에 각각 다른 URL을 기록합니다.",
          ]}
        />
      </Section>

      <Section heading="iOS와 안드로이드의 동작 차이">
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

      <Section heading="어디에 붙여야 하나요">
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

      <Section heading="아파트에 설치할 때 주의할 점">
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
    </TipPage>
  );
}
