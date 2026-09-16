import type { Metadata } from "next";
import DocPage, { Section, Sub, Bullets, Callout, DataTable } from "@/components/DocPage";
import { CONTACT_EMAIL, KAKAO_OPENCHAT } from "@/content/contact";

export const metadata: Metadata = {
  title: "개인정보처리방침 | 몇층",
  description:
    "몇층(MyFloor)이 수집·이용하는 정보, 브라우저 로컬 저장 방식, 푸시 알림 구독 정보 처리, Google AdSense 스크립트의 쿠키 사용에 대한 안내입니다.",
  alternates: { canonical: "/privacy" },
};

const UPDATED = "2026년 9월 15일";

export default function PrivacyPage() {
  return (
    <DocPage
      title="개인정보처리방침"
      lead="몇층(MyFloor, 이하 '서비스')은 이용자의 개인정보를 소중히 다룹니다. 이 방침은 서비스가 어떤 정보를 어떻게 처리하는지 설명합니다."
      updatedAt={UPDATED}
    >
      <Callout>
        몇층은 회원가입이 없습니다. 차량 이름과 주차 층수는 서버로 전송되지 않고 이용자의 브라우저
        안에만 저장됩니다. 서비스 운영자는 이용자가 어느 층에 주차했는지 알 수 없습니다.
      </Callout>

      <Section heading="1. 수집하는 정보와 처리 방식">
        <p>
          서비스는 이름·전화번호·이메일 등 이용자를 직접 식별할 수 있는 정보를 수집하지 않습니다.
          처리되는 정보는 아래가 전부입니다.
        </p>

        <Sub heading="가. 브라우저에만 저장되는 정보 (서버 전송 없음)">
          <p>
            아래 항목은 이용자 기기의 브라우저 로컬 스토리지(localStorage)에 저장되며, 서버로 전송되거나
            운영자가 열람할 수 없습니다.
          </p>
          <DataTable
            head={["저장 키", "내용", "보관"]}
            rows={[
              ["myfloor_data", "이용자가 입력한 차량 이름, 저장된 층수, 마지막 저장 시각", "이용자가 삭제할 때까지"],
              ["myfloor_alarms", "설정한 충전 알림의 차량·층수·알림 예정 시각", "알림 시각 경과 시 자동 삭제"],
              ["myfloor_seen_patch", "업데이트 안내를 이미 확인했는지 여부", "이용자가 삭제할 때까지"],
            ]}
          />
          <p>
            브라우저 설정에서 사이트 데이터를 삭제하거나, 앱 내에서 차량을 삭제하면 해당 정보는 즉시
            사라집니다. 별도의 삭제 요청 절차가 필요하지 않습니다.
          </p>
        </Sub>

        <Sub heading="나. 푸시 알림을 설정한 경우에만 서버에 저장되는 정보">
          <p>
            전기차 충전 완료 알림 등 푸시 알림을 이용자가 직접 설정하면, 예약된 시각에 알림을 보내기 위해
            아래 정보가 서버(Upstash Redis)에 저장됩니다.
          </p>
          <Bullets
            items={[
              "웹 푸시 구독 정보 (브라우저가 발급한 엔드포인트 URL 및 암호화 키) — 알림을 전달할 대상을 지정하는 값으로, 이용자 개인을 식별하는 값은 아닙니다.",
              "알림 내용 구성에 필요한 차량 이름, 층수, 알림 종류(완속/급속), 알림 예정 시각",
              "앱이 생성한 임의의 차량 식별자(UUID) — 중복 알림 제거 용도",
            ]}
          />
          <p>
            이 정보는 <strong className="text-main">알림이 발송되면 서버에서 즉시 삭제</strong>됩니다.
            이용자가 앱에서 알림을 취소하거나 차량을 삭제하면 그 시점에 삭제됩니다. 푸시 알림을 설정하지
            않으면 서버에 아무것도 저장되지 않습니다.
          </p>
        </Sub>

        <Sub heading="다. 접속 통계">
          <p>
            서비스 개선을 위해 Vercel Analytics를 사용해 페이지 조회수, 유입 경로, 기기 유형 등의 통계를
            수집합니다. Vercel Analytics는 쿠키를 사용하지 않으며 개별 방문자를 추적하지 않는 익명 집계
            방식으로 동작합니다.
          </p>
        </Sub>
      </Section>

      <Section heading="2. 광고 및 쿠키">
        <p>
          <strong className="text-main">현재 서비스 화면에는 광고가 게재되지 않습니다.</strong> 다만
          향후 광고 게재를 위해 Google AdSense 스크립트가 페이지에 로드되어 있으며, 이 스크립트는
          쿠키 또는 유사 기술을 사용할 수 있습니다. 실제로 광고가 게재되기 시작하면 아래 내용이
          그대로 적용됩니다.
        </p>

        <Sub heading="가. Google AdSense">
          <Bullets
            items={[
              "Google을 포함한 제3자 광고 사업자는 쿠키를 사용하여 이용자의 이 사이트 및 다른 사이트 방문 기록을 바탕으로 광고를 게재할 수 있습니다.",
              <>
                Google이 광고 쿠키를 사용하면, 이용자는{" "}
                <a
                  href="https://www.google.com/settings/ads"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main underline underline-offset-2"
                >
                  광고 설정
                </a>
                에서 맞춤 광고를 사용 중지할 수 있습니다.
              </>,
              <>
                Google의 데이터 처리 방식은{" "}
                <a
                  href="https://policies.google.com/technologies/partner-sites"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main underline underline-offset-2"
                >
                  Google 파트너 사이트 정책
                </a>
                에서 확인할 수 있습니다.
              </>,
              <>
                제3자 광고 사업자의 맞춤 광고는{" "}
                <a
                  href="https://www.aboutads.info/choices/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-main underline underline-offset-2"
                >
                  aboutads.info
                </a>
                에서도 일괄 거부할 수 있습니다.
              </>,
            ]}
          />
        </Sub>

        <Sub heading="나. 쿠키 거부 방법">
          <p>
            이용자는 사용 중인 브라우저의 설정(예: Chrome → 설정 → 개인정보 보호 및 보안 → 서드파티 쿠키)
            에서 쿠키 저장을 차단할 수 있습니다. 다만 쿠키를 차단해도 서비스의 핵심 기능(주차 층수 저장·조회)
            은 정상적으로 동작합니다.
          </p>
        </Sub>
      </Section>

      <Section heading="3. 제3자 제공 및 처리 위탁">
        <p>
          서비스는 이용자의 정보를 판매하거나 광고 목적으로 제3자에게 제공하지 않습니다. 서비스 운영에
          필요한 범위에서 아래 사업자의 인프라를 이용합니다.
        </p>
        <DataTable
          head={["사업자", "역할", "처리 정보"]}
          rows={[
            ["Vercel Inc.", "웹 호스팅 및 접속 통계", "접속 로그, 익명 통계"],
            ["Upstash Inc.", "푸시 알림 예약 저장소", "푸시 구독 정보, 차량명, 층수 (알림 발송 후 삭제)"],
            ["Google LLC", "AdSense 스크립트 로드 (광고 게재 예정)", "광고 쿠키 기반 정보"],
          ]}
        />
        <p>
          위 사업자 중 일부는 국외에 서버를 두고 있어 정보가 국외에서 처리될 수 있습니다. 서비스를
          이용함으로써 이에 동의한 것으로 봅니다.
        </p>
      </Section>

      <Section heading="4. 보유 및 파기">
        <Bullets
          items={[
            "브라우저에 저장된 정보: 이용자가 직접 삭제하거나 브라우저 데이터를 지울 때까지 보관되며, 운영자는 접근할 수 없습니다.",
            "푸시 알림 정보: 알림 발송 완료, 이용자의 알림 취소, 차량 삭제 중 가장 먼저 발생하는 시점에 삭제됩니다.",
            "접속 통계: 통계 형태로만 보관되며 개별 이용자와 연결되지 않습니다.",
          ]}
        />
      </Section>

      <Section heading="5. 이용자의 권리">
        <p>
          이용자는 언제든지 앱 화면에서 등록한 차량을 삭제하거나 알림을 취소하는 방식으로 자신의 정보를
          삭제할 수 있습니다. 브라우저의 사이트 데이터 삭제 기능을 사용하면 서비스가 저장한 모든 정보가
          한 번에 제거됩니다. 그 밖의 문의나 요청은 아래 연락처로 접수해 주세요.
        </p>
      </Section>

      <Section heading="6. 아동의 개인정보">
        <p>
          서비스는 만 14세 미만 아동을 대상으로 하지 않으며, 아동의 개인정보를 의도적으로 수집하지 않습니다.
        </p>
      </Section>

      <Section heading="7. 보안">
        <p>
          서비스는 HTTPS로만 제공되어 전송 구간이 암호화됩니다. 주차 기록이 서버로 전송되지 않는 구조이므로
          서버 침해로 인한 주차 기록 유출 위험이 원천적으로 존재하지 않습니다.
        </p>
      </Section>

      <Section heading="8. 방침의 변경">
        <p>
          이 방침이 변경되는 경우 이 페이지에 변경 내용과 최종 수정일을 게시합니다. 중요한 변경이 있을 때는
          서비스 화면에서 별도로 안내합니다.
        </p>
      </Section>

      <Section heading="9. 문의처">
        <p>
          개인정보 처리에 관한 문의, 열람·삭제 요청은 아래로 연락해 주시면 순차적으로
          답변드립니다.
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
