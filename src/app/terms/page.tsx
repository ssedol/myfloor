import type { Metadata } from "next";
import DocPage, { Section, Bullets, Callout } from "@/components/DocPage";
import { CONTACT_EMAIL, KAKAO_OPENCHAT } from "@/content/contact";

export const metadata: Metadata = {
  title: "이용약관 | 몇층",
  description:
    "몇층(MyFloor) 서비스 이용약관입니다. 서비스 제공 범위, 이용자의 책임, 데이터 보관 방식, 면책 사항을 안내합니다.",
  alternates: { canonical: "/terms" },
};

const UPDATED = "2026년 9월 15일";

export default function TermsPage() {
  return (
    <DocPage
      title="이용약관"
      lead="몇층(MyFloor)을 이용하기 전에 아래 내용을 확인해 주세요."
      updatedAt={UPDATED}
    >
      <Callout>
        몇층은 무료로 제공되는 개인 개발 서비스입니다. 주차 기록이 사용자 기기에만 저장되므로,
        브라우저 데이터가 삭제되면 기록도 함께 사라진다는 점을 반드시 이해하고 사용해 주세요.
      </Callout>

      <Section heading="제1조 (목적)">
        <p>
          이 약관은 몇층(MyFloor, 이하 &ldquo;서비스&rdquo;)이 제공하는 주차 위치 기록 기능의 이용 조건과
          절차, 이용자와 운영자의 권리·의무를 정하는 것을 목적으로 합니다.
        </p>
      </Section>

      <Section heading="제2조 (서비스의 내용)">
        <p>서비스는 다음 기능을 무료로 제공합니다.</p>
        <Bullets
          items={[
            "차량 이름 등록 및 주차 층수 저장·조회 (최대 3대)",
            "저장된 주차 위치를 링크로 가족·지인에게 공유",
            "전기차 완속·급속 충전 시간에 맞춘 푸시 알림 예약",
            "NFC 태그 또는 QR 코드를 통한 층수 자동 저장 (설치된 건물에 한함)",
            "홈 화면 설치(PWA) 및 오프라인 조회",
          ]}
        />
      </Section>

      <Section heading="제3조 (회원가입 없는 이용)">
        <p>
          서비스는 회원가입, 로그인, 개인정보 입력을 요구하지 않습니다. 따라서 이용자 계정이라는 개념이
          존재하지 않으며, 서비스에 접속한 브라우저 단위로 데이터가 관리됩니다.
        </p>
      </Section>

      <Section heading="제4조 (데이터 보관과 소실에 관한 고지)">
        <p>
          이용자가 입력한 차량 이름과 주차 층수는 서버가 아닌 <strong className="text-main">이용자
          기기의 브라우저 저장소</strong>에 보관됩니다. 이에 따라 다음의 경우 데이터가 복구 불가능하게
          사라질 수 있으며, 운영자는 이를 복원할 수단을 가지고 있지 않습니다.
        </p>
        <Bullets
          items={[
            "브라우저의 쿠키·사이트 데이터·인터넷 사용 기록 삭제",
            "시크릿 모드(개인정보 보호 모드)에서 이용 후 창을 닫은 경우",
            "카카오톡·인스타그램 등 앱 내장 브라우저와 일반 브라우저를 번갈아 사용하는 경우",
            "기기 변경, 앱 재설치, 브라우저 변경",
            "iOS Safari가 장기간 미사용 사이트의 저장 데이터를 자동 정리하는 경우",
          ]}
        />
        <p>
          안정적인 보관을 위해 홈 화면에 설치(PWA)한 뒤 해당 아이콘으로만 접속하시기를 권장합니다.
        </p>
      </Section>

      <Section heading="제5조 (이용자의 책임)">
        <Bullets
          items={[
            "이용자는 차량 이름 등 입력란에 타인의 개인정보나 차량 번호 등 민감한 정보를 입력하지 않아야 합니다.",
            "공유 링크에는 주차 층수 정보가 포함되므로, 불특정 다수에게 공개되는 곳에 게시하지 않아야 합니다.",
            "서비스를 자동화 도구로 과도하게 호출하거나 정상적인 운영을 방해하는 행위를 해서는 안 됩니다.",
            "건물에 설치된 NFC 태그·QR 코드를 훼손하거나 무단으로 복제·변조해서는 안 됩니다.",
          ]}
        />
      </Section>

      <Section heading="제6조 (광고의 게재)">
        <p>
          현재 서비스 화면에는 광고가 게재되지 않습니다. 향후 무료 운영을 위해 Google AdSense 등
          제3자 광고를 게재할 수 있으며, 그 경우 광고의 내용과 광고주와의 거래는 해당 광고 사업자 및
          광고주의 책임입니다. 운영자는 광고를 통해 연결된 외부 사이트의 상품·서비스에 대해 책임지지
          않습니다. 광고 관련 쿠키 처리는{" "}
          <a href="/privacy" className="text-main underline underline-offset-2">
            개인정보처리방침
          </a>
          을 참고해 주세요.
        </p>
      </Section>

      <Section heading="제7조 (푸시 알림)">
        <p>
          충전 알림은 이용자가 직접 설정한 경우에만 발송됩니다. 알림은 브라우저와 운영체제의 푸시 전송망을
          거치므로, 기기의 절전 모드·네트워크 상태·알림 권한 설정에 따라 지연되거나 도달하지 않을 수
          있습니다. 알림은 편의를 위한 보조 기능이며, 충전 종료 시점을 보장하지 않습니다.
        </p>
      </Section>

      <Section heading="제8조 (면책)">
        <Bullets
          items={[
            "서비스는 있는 그대로(as-is) 제공되며, 무중단 동작이나 데이터의 영구 보존을 보장하지 않습니다.",
            "저장된 층수 정보의 정확성은 이용자의 입력에 따릅니다. 잘못 입력된 층수로 인한 불편에 대해 운영자는 책임지지 않습니다.",
            "주차장 이용 중 발생한 차량 손상·도난·과태료 등 물리적 사고에 대해 서비스는 어떠한 책임도 지지 않습니다.",
            "천재지변, 호스팅 사업자 장애 등 운영자의 통제를 벗어난 사유로 인한 서비스 중단에 대해 책임이 면제됩니다.",
          ]}
        />
      </Section>

      <Section heading="제9조 (서비스의 변경 및 중단)">
        <p>
          운영자는 서비스의 기능을 변경하거나 일부 또는 전부를 중단할 수 있습니다. 서비스를 영구히 종료하는
          경우, 가능한 범위에서 사전에 서비스 화면을 통해 안내합니다.
        </p>
      </Section>

      <Section heading="제10조 (지식재산권)">
        <p>
          서비스의 디자인, 문구, 코드 등 창작물에 대한 권리는 운영자에게 있습니다. 이용자가 입력한 차량
          이름 등의 내용에 대한 권리는 이용자에게 있으며, 해당 정보는 이용자 기기에만 저장됩니다.
        </p>
      </Section>

      <Section heading="제11조 (약관의 변경)">
        <p>
          이 약관은 필요에 따라 변경될 수 있으며, 변경된 약관은 이 페이지에 게시한 시점부터 효력이
          발생합니다. 변경 후에도 서비스를 계속 이용하는 경우 변경된 약관에 동의한 것으로 봅니다.
        </p>
      </Section>

      <Section heading="제12조 (문의)">
        <p>
          약관에 관한 문의는 아래로 연락해 주세요.
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
      </Section>
    </DocPage>
  );
}
