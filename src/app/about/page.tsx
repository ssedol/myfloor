import type { Metadata } from "next";
import Link from "next/link";
import DocPage, { Section, Bullets, Callout, DataTable } from "@/components/DocPage";
import { CONTACT_EMAIL, KAKAO_OPENCHAT } from "@/content/contact";

export const metadata: Metadata = {
  title: "서비스 소개 및 문의 | 몇층",
  description:
    "몇층(MyFloor)은 지하주차장에서 차를 어디에 세웠는지 잊어버리는 문제를 해결하는 무료 웹앱입니다. 서비스를 만든 이유, 동작 방식, 문의 방법을 안내합니다.",
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  return (
    <DocPage
      title="서비스 소개"
      lead="몇층(MyFloor)은 '내 차 어느 층에 세웠지?'라는 하루 몇 초의 막막함을 없애기 위해 만든 무료 웹앱입니다."
    >
      <Section heading="어떤 문제를 푸나요">
        <p>
          요즘 아파트 지하주차장은 B1부터 B8까지 내려가고, 한 층이 축구장 몇 개 넓이인 경우도 흔합니다.
          매일 같은 자리에 대지 않는 이상, 주차하고 엘리베이터를 타는 그 30초 사이에 층수를 잊는 일이
          반복됩니다. 퇴근 후 지친 상태로 지하 3층과 5층을 오가며 차를 찾아본 경험은 대부분의 운전자에게
          있습니다.
        </p>
        <p>
          기존 해결책은 모두 마찰이 컸습니다. 메모 앱은 켜고, 지우고, 다시 쓰는 과정이 번거롭고, 사진을
          찍으면 나중에 사진첩에서 찾아야 합니다. 차량 위치 기록을 지원하는 내비게이션 앱은 GPS가 잡히지
          않는 지하에서는 무용지물입니다. 몇층은 <strong className="text-main">지하에서 GPS 없이, 탭 두
          번으로 끝나는 방식</strong>을 선택했습니다.
        </p>
      </Section>

      <Section heading="어떻게 동작하나요">
        <Bullets
          items={[
            "차량 이름을 등록합니다. '아빠차', '흰색 소나타'처럼 본인이 알아볼 수 있는 이름이면 충분합니다. 최대 3대까지 등록할 수 있어 가족 차량을 함께 관리할 수 있습니다.",
            "주차 후 차량 카드의 층수 영역을 탭하고 층을 고르면 저장이 끝납니다. 지하(B1~B8)와 지상(1F~8F)을 모두 지원합니다.",
            "차를 찾으러 갈 때는 앱을 열기만 하면 됩니다. 마지막으로 저장한 층수와 저장 시각이 바로 보입니다.",
            "공유 버튼을 누르면 링크가 생성됩니다. 가족이 그 링크를 열면 같은 층수가 자동으로 저장되어, 서로 다른 사람이 세운 차도 찾을 수 있습니다.",
            "전기차라면 완속·급속 충전 시간에 맞춰 푸시 알림을 예약할 수 있습니다. 충전이 끝날 무렵 알림이 와서 다음 차량을 위해 자리를 비워줄 수 있습니다.",
          ]}
        />
      </Section>

      <Section heading="설치가 필요 없습니다">
        <p>
          몇층은 앱스토어를 거치지 않는 웹앱(PWA)입니다. 브라우저에서 주소만 열면 바로 쓸 수 있고, 홈
          화면에 추가하면 일반 앱처럼 아이콘으로 실행됩니다. 앱 용량을 차지하지 않고, 업데이트도 자동으로
          반영됩니다. 설치 방법은{" "}
          <Link href="/install" className="text-main underline underline-offset-2">
            홈 화면 설치 안내
          </Link>
          를 참고하세요.
        </p>
      </Section>

      <Section heading="회원가입이 없습니다">
        <p>
          이름, 전화번호, 이메일, 차량 번호 중 무엇도 요구하지 않습니다. 입력한 차량 이름과 층수는 서버로
          전송되지 않고 사용 중인 브라우저 안에만 저장됩니다. 운영자조차 누가 어느 층에 주차했는지 알
          수 없는 구조입니다.
        </p>
        <Callout>
          다만 이 구조에는 대가가 있습니다. 브라우저 데이터를 지우거나 다른 브라우저로 접속하면 기록이
          보이지 않습니다. 홈 화면에 설치해 그 아이콘으로만 사용하시는 것을 권장합니다.
        </Callout>
      </Section>

      <Section heading="NFC 태그 · QR 코드 (건물 단위 옵션)">
        <p>
          층마다 NFC 스티커나 QR 코드를 붙여두면, 주차 후 휴대폰을 가져다 대기만 해도 층수가 자동으로
          저장됩니다. 앱을 열 필요도, 층을 고를 필요도 없어집니다. 입주민이나 관리사무소에서 설치를
          원하시면 아래 문의처로 연락 주세요. 태그 자체는 저렴한 NTAG213 스티커이며, 층별 URL은 위조를
          막기 위해 서명 검증을 거칩니다.
        </p>
      </Section>

      <Section heading="운영 정보">
        <DataTable
          head={["항목", "내용"]}
          rows={[
            ["서비스명", "몇층 (MyFloor)"],
            ["주소", "myfloor.website"],
            ["형태", "개인이 만들어 무료로 운영하는 웹앱(PWA)"],
            ["비용", "전액 무료. 결제 수단을 요구하지 않으며, 현재 화면에 광고도 없습니다."],
            ["지원 환경", "iOS Safari, Android Chrome 등 최신 모바일 브라우저"],
          ]}
        />
      </Section>

      <Section heading="문의하기">
        <p>
          버그 제보, 기능 제안, NFC·QR 설치 문의를 받고 있습니다. 개인이 운영하는 서비스라 답변이
          하루 이틀 늦을 수 있는 점 양해 부탁드립니다.
        </p>
        <Bullets
          items={[
            <>
              이메일:{" "}
              <a
                key="mail"
                href={`mailto:${CONTACT_EMAIL}`}
                className="text-main underline underline-offset-2"
              >
                {CONTACT_EMAIL}
              </a>
            </>,
            <>
              카카오톡:{" "}
              <a
                key="kakao"
                href={KAKAO_OPENCHAT}
                target="_blank"
                rel="noopener noreferrer"
                className="text-main underline underline-offset-2"
              >
                오픈채팅 바로가기
              </a>
            </>,
          ]}
        />
        <div className="flex flex-wrap gap-2 mt-1">
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="inline-block px-5 py-2.5 bg-primary text-white text-sm font-semibold rounded-xl active:opacity-70"
          >
            이메일로 문의하기
          </a>
          <a
            href={KAKAO_OPENCHAT}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block px-5 py-2.5 border border-divider text-main text-sm font-semibold rounded-xl active:opacity-70"
          >
            카카오톡 오픈채팅
          </a>
        </div>
      </Section>

      <Section heading="더 읽어보기">
        <Bullets
          items={[
            <Link key="g" href="/guide" className="text-main underline underline-offset-2">
              사용 가이드 — 처음 시작하는 방법
            </Link>,
            <Link key="t" href="/tips" className="text-main underline underline-offset-2">
              주차 정보 — 차를 못 찾을 때, 전기차 충전, NFC 활용법
            </Link>,
            <Link key="f" href="/faq" className="text-main underline underline-offset-2">
              자주 묻는 질문
            </Link>,
          ]}
        />
      </Section>
    </DocPage>
  );
}
