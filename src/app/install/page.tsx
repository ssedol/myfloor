"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import KakaoAd from "@/components/KakaoAd";

const BROWN = "#40342E";
const GREEN = "#9BC72E";
const BG = "#F5F3EF";
const SURFACE = "#ECEAE4";
const SUB = "#8B7B72";
const DIVIDER = "#D5CEC6";
const WHITE = "#FFFFFF";
const AMBER = "#F59E0B";

function OSSection({
  icon,
  title,
  color,
  steps,
  note,
}: {
  icon: string;
  title: string;
  color: string;
  steps: { icon: string; text: string; sub?: string }[];
  note?: string;
}) {
  return (
    <div
      style={{
        background: BG,
        borderRadius: 20,
        padding: "18px 18px 16px",
        marginBottom: 14,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 14,
        }}
      >
        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: 10,
            background: color,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 18,
            flexShrink: 0,
          }}
        >
          {icon}
        </div>
        <span style={{ fontSize: 15, fontWeight: 700, color: BROWN }}>
          {title}
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((step, i) => (
          <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
            <div
              style={{
                width: 24,
                height: 24,
                borderRadius: 12,
                background: color,
                color: WHITE,
                fontSize: 12,
                fontWeight: 800,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {i + 1}
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: BROWN, lineHeight: 1.4 }}>
                <span style={{ marginRight: 5 }}>{step.icon}</span>
                {step.text}
              </div>
              {step.sub && (
                <div style={{ fontSize: 11, color: SUB, marginTop: 2, lineHeight: 1.4 }}>
                  {step.sub}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {note && (
        <div
          style={{
            marginTop: 12,
            padding: "8px 12px",
            background: `${color}22`,
            borderRadius: 10,
            fontSize: 11,
            color: SUB,
            lineHeight: 1.5,
          }}
        >
          {note}
        </div>
      )}
    </div>
  );
}

function BackLink() {
  const searchParams = useSearchParams();
  const from = searchParams.get("from");
  const backHref = from === "main" ? "/" : "/guide";
  const backLabel = from === "main" ? "← 메인으로 돌아가기" : "← 사용 가이드로 돌아가기";
  return (
    <a
      href={backHref}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 4,
        fontSize: 14,
        fontWeight: 600,
        color: BROWN,
        textDecoration: "none",
        background: WHITE,
        border: `1px solid ${DIVIDER}`,
        borderRadius: 14,
        padding: "13px 0",
      }}
    >
      {backLabel}
    </a>
  );
}

export default function InstallPage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: ${SURFACE}; overflow-x: hidden; }
        .wrap { max-width: 440px; margin: 0 auto; padding: 28px 16px 48px; }
      `}</style>

      <div
        className="wrap"
        style={{
          fontFamily:
            '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        <div
          style={{
            background: WHITE,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(64,52,46,0.12)",
          }}
        >
          {/* 헤더 */}
          <div
            style={{
              background: BROWN,
              padding: "28px 24px 24px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 10 }}>📲</div>
            <h1
              style={{
                fontSize: 20,
                fontWeight: 800,
                color: WHITE,
                margin: 0,
                lineHeight: 1.35,
                letterSpacing: "-0.03em",
              }}
            >
              홈 화면에 설치하고
              <br />
              제대로 사용하세요
            </h1>
            <p
              style={{
                color: "rgba(255,255,255,0.6)",
                fontSize: 13,
                marginTop: 10,
                lineHeight: 1.6,
                margin: "10px 0 0",
              }}
            >
              설치하지 않으면 충전 알림이 오지 않아요
            </p>
          </div>

          {/* 왜 설치해야 하나요 */}
          <div
            style={{
              background: `${AMBER}18`,
              borderBottom: `1px solid ${DIVIDER}`,
              padding: "14px 20px",
            }}
          >
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: "#92400E",
                margin: "0 0 8px",
              }}
            >
              ⚠️ 설치가 필요한 이유
            </p>
            <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
              {[
                "충전 알림은 홈 화면 설치 앱에서만 수신돼요",
                "매번 주소 입력 없이 아이콘 탭 하나로 열려요",
                "전체 화면으로 앱처럼 사용할 수 있어요",
              ].map((t) => (
                <div
                  key={t}
                  style={{ display: "flex", gap: 6, alignItems: "flex-start" }}
                >
                  <span style={{ color: AMBER, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ fontSize: 12, color: "#78350F", lineHeight: 1.5 }}>
                    {t}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* 본문 */}
          <div style={{ padding: "22px 20px 24px" }}>
            <p
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: GREEN,
                letterSpacing: "0.08em",
                marginBottom: 16,
                margin: "0 0 16px",
              }}
            >
              INSTALL GUIDE · 설치 방법
            </p>

            <OSSection
              icon="🤖"
              title="안드로이드 (Chrome)"
              color={GREEN}
              steps={[
                {
                  icon: "🌐",
                  text: "Chrome으로 myfloor.website 접속",
                },
                {
                  icon: "⋮",
                  text: "오른쪽 상단 점 3개 메뉴 탭",
                },
                {
                  icon: "📲",
                  text: "'홈 화면에 추가' 또는 '앱 설치' 선택",
                  sub: "기기나 Chrome 버전에 따라 문구가 다를 수 있어요",
                },
                {
                  icon: "✅",
                  text: "'설치' 또는 '추가' 버튼 탭해서 완료",
                },
              ]}
              note="Samsung Internet 브라우저는 하단 메뉴 → '홈 화면에 추가'를 선택하세요"
            />

            <OSSection
              icon="🍎"
              title="아이폰 (Safari)"
              color="#555"
              steps={[
                {
                  icon: "🧭",
                  text: "Safari로 myfloor.website 접속",
                  sub: "반드시 Safari를 사용해야 해요. Chrome은 홈 화면 추가가 안 돼요",
                },
                {
                  icon: "□↑",
                  text: "하단 가운데 공유 버튼 탭",
                  sub: "네모 위로 화살표가 있는 아이콘이에요",
                },
                {
                  icon: "➕",
                  text: "'홈 화면에 추가' 선택",
                  sub: "목록을 아래로 스크롤하면 나와요",
                },
                {
                  icon: "✅",
                  text: "오른쪽 상단 '추가' 탭해서 완료",
                },
              ]}
              note="iOS 16.4 이상에서 Safari로 설치해야 충전 알림 수신이 가능해요"
            />

            {/* 완료 메시지 */}
            <div
              style={{
                marginTop: 6,
                padding: "14px 16px",
                background: `${GREEN}18`,
                borderRadius: 16,
                textAlign: "center",
              }}
            >
              <div style={{ fontSize: 22, marginBottom: 6 }}>🎉</div>
              <p
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: BROWN,
                  margin: "0 0 4px",
                }}
              >
                설치 완료!
              </p>
              <p style={{ fontSize: 12, color: SUB, margin: 0, lineHeight: 1.5 }}>
                홈 화면의 <b style={{ color: BROWN }}>몇층</b> 아이콘을 탭해서 실행하면
                <br />
                충전 알림 포함 모든 기능을 이용할 수 있어요
              </p>
            </div>
          </div>
        </div>

        {/* 설치가 왜 필요한지에 대한 본문 */}
        <section
          style={{
            marginTop: 20,
            background: WHITE,
            borderRadius: 24,
            padding: "22px 20px",
            boxShadow: "0 12px 40px rgba(64,52,46,0.08)",
          }}
        >
          <h2 style={{ fontSize: 16, fontWeight: 800, color: BROWN, margin: "0 0 10px", letterSpacing: "-0.02em" }}>
            왜 홈 화면에 설치해야 하나요?
          </h2>
          <p style={{ fontSize: 13, color: SUB, lineHeight: 1.75, margin: "0 0 14px" }}>
            몇층은 앱스토어를 거치지 않는 웹앱(PWA)입니다. 브라우저 주소창으로 들어와도 기능은
            똑같이 동작하지만, 주차 기록이 <b style={{ color: BROWN }}>브라우저의 저장 공간</b>에
            들어간다는 점이 문제가 됩니다. 브라우저 저장 공간은 생각보다 쉽게 비워집니다.
          </p>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: BROWN, margin: "0 0 8px" }}>
            설치하지 않으면 생기는 일
          </h3>
          <ul style={{ margin: "0 0 16px", padding: 0, listStyle: "none" }}>
            {[
              "카카오톡에서 받은 공유 링크를 그대로 열면, 카카오톡 내부 브라우저의 별도 저장 공간이 쓰입니다. 등록해 둔 차량이 하나도 보이지 않습니다.",
              "브라우저에서 '인터넷 사용 기록 삭제'를 하면 주차 기록도 함께 지워집니다. 서버에 사본이 없어 복구가 불가능합니다.",
              "아이폰 Safari는 오래 방문하지 않은 사이트의 저장 데이터를 자동으로 정리합니다.",
              "충전 알림(푸시)은 브라우저 탭 상태에서는 수신되지 않습니다. 특히 아이폰은 홈 화면에 추가한 경우에만 알림이 도착합니다.",
            ].map((text) => (
              <li
                key={text}
                style={{ display: "flex", gap: 8, fontSize: 13, color: SUB, lineHeight: 1.7, marginBottom: 8 }}
              >
                <span style={{ color: GREEN, flexShrink: 0, fontWeight: 700 }}>·</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: BROWN, margin: "0 0 8px" }}>
            설치하면 달라지는 점
          </h3>
          <p style={{ fontSize: 13, color: SUB, lineHeight: 1.75, margin: "0 0 14px" }}>
            홈 화면 아이콘으로 실행하면 브라우저와 분리된 전용 저장 공간을 쓰게 되어 기록이 훨씬
            안정적으로 유지됩니다. 주소창과 탭 바가 사라져 화면도 넓어지고, 주차장처럼 신호가 약한
            곳에서도 저장해 둔 층수를 바로 확인할 수 있습니다. 앱 용량을 거의 차지하지 않으며
            업데이트는 자동으로 반영됩니다.
          </p>

          <h3 style={{ fontSize: 14, fontWeight: 700, color: BROWN, margin: "0 0 8px" }}>
            설치가 안 될 때
          </h3>
          <p style={{ fontSize: 13, color: SUB, lineHeight: 1.75, margin: 0 }}>
            아이폰에서 &lsquo;홈 화면에 추가&rsquo; 항목이 보이지 않는다면 Chrome이나 카카오톡
            내부 브라우저를 쓰고 있을 가능성이 높습니다. 아이폰은 <b style={{ color: BROWN }}>Safari
            에서만</b> 홈 화면 추가가 가능하니, 주소를 복사해 Safari에서 다시 열어주세요.
            안드로이드에서 메뉴에 항목이 없다면 Chrome을 최신 버전으로 업데이트한 뒤 다시
            시도하면 대부분 해결됩니다.
          </p>
        </section>

        {/* 뒤로가기 */}
        <div style={{ marginTop: 20 }}>
          <Suspense fallback={null}>
            <BackLink />
          </Suspense>
        </div>

        <div style={{ marginTop: 16, border: `1px solid ${DIVIDER}`, borderRadius: 16, overflow: "hidden" }}>
          <p style={{ textAlign: "center", fontSize: 10, color: SUB, padding: "4px 0", background: "#ECEAE4", borderBottom: `1px solid ${DIVIDER}`, margin: 0 }}>광고</p>
          <KakaoAd unit="DAN-FtUdPgq37o1OxLht" width={320} height={100} />
        </div>
      </div>
    </>
  );
}
