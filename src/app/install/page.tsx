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
        fontSize: 13,
        color: SUB,
        textDecoration: "none",
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
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

        {/* 뒤로가기 */}
        <div style={{ textAlign: "center", marginTop: 20 }}>
          <Suspense fallback={<a href="/guide" style={{ fontSize: 13, color: SUB, textDecoration: "none" }}>← 돌아가기</a>}>
            <BackLink />
          </Suspense>
        </div>

        <div style={{ marginTop: 16 }}>
          <KakaoAd unit="DAN-oYPaMtfocTonepcI" width={320} height={480} />
          <KakaoAd unit="DAN-FtUdPgq37o1OxLht" width={320} height={100} />
          <KakaoAd unit="DAN-9slwEqjwC1yDXbJL" width={320} height={480} />
        </div>
      </div>
    </>
  );
}
