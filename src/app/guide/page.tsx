"use client";

export const dynamic = "force-static";

const APP_URL = "myfloor.website";

const BROWN = "#40342E";
const GREEN = "#9BC72E";
const BG = "#F5F3EF";
const SURFACE = "#ECEAE4";
const SUB = "#8B7B72";
const DIVIDER = "#D5CEC6";

function StepNum({ n }: { n: number }) {
  return (
    <div style={{
      width: 32, height: 32, borderRadius: 16,
      background: GREEN, color: "#fff",
      fontWeight: 700, fontSize: 15,
      display: "flex", alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {n}
    </div>
  );
}

function Step({ n, text, sub }: { n: number; text: string; sub?: string }) {
  return (
    <div style={{ display: "flex", gap: 12, marginBottom: 14, alignItems: "flex-start" }}>
      <StepNum n={n} />
      <div style={{ paddingTop: 5 }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: BROWN, lineHeight: 1.4 }}>{text}</div>
        {sub && <div style={{ fontSize: 12, color: SUB, marginTop: 2, lineHeight: 1.4 }}>{sub}</div>}
      </div>
    </div>
  );
}

function BarMockup({ os }: { os: "ios" | "android" }) {
  return (
    <div style={{
      border: `1.5px solid ${DIVIDER}`, borderRadius: 14,
      overflow: "hidden", background: "#fff",
    }}>
      <div style={{
        background: os === "ios" ? BG : "#3C4043",
        padding: "6px 10px",
        display: "flex", alignItems: "center", gap: 6,
        fontSize: 11,
        color: os === "ios" ? BROWN : "#fff",
      }}>
        {os === "ios" ? (
          <>
            <span style={{ opacity: 0.4, fontSize: 13 }}>‹</span>
            <div style={{ flex: 1, background: "#E5E5EA", borderRadius: 6, padding: "3px 8px", color: "#333", textAlign: "center" }}>
              {APP_URL}
            </div>
            <span style={{ fontSize: 14, opacity: 0.6 }}>⬆</span>
          </>
        ) : (
          <>
            <div style={{ flex: 1, background: "#fff", borderRadius: 20, padding: "3px 10px", color: "#333", textAlign: "center" }}>
              {APP_URL}
            </div>
            <span style={{ fontWeight: 700, letterSpacing: 1 }}>⋮</span>
          </>
        )}
      </div>
      <div style={{ padding: "14px 12px", textAlign: "center" }}>
        {os === "ios" ? (
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 11, color: SUB }}>하단 가운데 공유 버튼 탭</div>
            <div style={{
              background: SURFACE, borderRadius: 10, padding: "8px 16px",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 600, color: BROWN,
            }}>
              <span style={{ fontSize: 18 }}>⬆</span> 공유
            </div>
          </div>
        ) : (
          <div style={{ display: "inline-flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
            <div style={{ fontSize: 11, color: SUB }}>메뉴(⋮) → 홈 화면에 추가</div>
            <div style={{
              background: SURFACE, borderRadius: 10, padding: "8px 16px",
              display: "flex", alignItems: "center", gap: 8,
              fontSize: 13, fontWeight: 600, color: BROWN,
            }}>
              <span style={{ fontSize: 18 }}>⊕</span> 홈 화면에 추가
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function OSCard({ os, steps }: { os: "ios" | "android"; steps: { text: string; sub?: string }[] }) {
  const isIOS = os === "ios";
  return (
    <div style={{
      background: BG, borderRadius: 20, padding: "22px 18px",
      flex: 1,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: isIOS ? "#1C1C1E" : "#4285F4",
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 20,
        }}>
          {isIOS ? "🍎" : "🤖"}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: BROWN }}>
            {isIOS ? "아이폰 (iPhone)" : "안드로이드"}
          </div>
          <div style={{ fontSize: 11, color: SUB }}>
            {isIOS ? "Safari 브라우저 사용" : "Chrome 브라우저 사용"}
          </div>
        </div>
      </div>

      <BarMockup os={os} />

      <div style={{ marginTop: 18 }}>
        {steps.map((s, i) => (
          <Step key={i} n={i + 1} text={s.text} sub={s.sub} />
        ))}
      </div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <>
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: #fff !important; }
          @page { margin: 10mm; }
        }
      `}</style>

      <div style={{
        maxWidth: 760, margin: "0 auto", padding: "36px 24px",
        fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
      }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 10,
            background: BROWN, borderRadius: 14, padding: "8px 18px",
            marginBottom: 14,
          }}>
            <span style={{ color: GREEN, fontSize: 18, fontWeight: 800, letterSpacing: "-0.02em" }}>몇층</span>
            <span style={{ color: "rgba(255,255,255,0.3)", fontSize: 12 }}>|</span>
            <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 12, fontWeight: 500 }}>빌리브 어바인시티</span>
          </div>

          <h1 style={{ fontSize: 24, fontWeight: 800, color: BROWN, marginBottom: 8, letterSpacing: "-0.03em" }}>
            📱 홈 화면에 추가하는 방법
          </h1>
          <p style={{ color: SUB, fontSize: 14 }}>
            아래 주소로 접속 후 스마트폰 기종에 맞게 따라해 주세요
          </p>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: SURFACE, border: `1.5px solid ${DIVIDER}`,
            borderRadius: 12, padding: "10px 20px",
            marginTop: 12,
            fontSize: 15, fontWeight: 700, color: BROWN,
            letterSpacing: "0.01em",
          }}>
            🌐&nbsp; {APP_URL}
          </div>
        </div>

        {/* Two columns */}
        <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
          <OSCard
            os="ios"
            steps={[
              { text: `Safari로 ${APP_URL} 접속`, sub: "Chrome 등 다른 브라우저는 설치 불가" },
              { text: "화면 하단 가운데 공유 버튼(⬆) 탭" },
              { text: "스크롤 내려 '홈 화면에 추가' 선택" },
              { text: "우측 상단 '추가' 탭 → 완료!" },
            ]}
          />
          <OSCard
            os="android"
            steps={[
              { text: `Chrome으로 ${APP_URL} 접속` },
              { text: "우측 상단 메뉴 버튼(⋮) 탭" },
              { text: "'홈 화면에 추가' 또는 '앱 설치' 선택", sub: "배너가 자동으로 뜨는 경우도 있어요" },
              { text: "'추가' 탭 → 완료!" },
            ]}
          />
        </div>

        {/* Tip */}
        <div style={{
          marginTop: 24, padding: "14px 18px",
          background: BG, border: `1px solid ${DIVIDER}`,
          borderRadius: 14, display: "flex", alignItems: "flex-start", gap: 10,
        }}>
          <span style={{ fontSize: 18, flexShrink: 0 }}>💡</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: BROWN, marginBottom: 3 }}>
              앱 아이콘이 생기면
            </div>
            <div style={{ fontSize: 13, color: SUB, lineHeight: 1.6 }}>
              주차 후 NFC 스티커를 태그하면 층수가 자동으로 저장됩니다.
              주차 위치를 가족과 공유하려면 카드의 공유 버튼을 이용하세요.
            </div>
          </div>
        </div>

        {/* Print button */}
        <div className="no-print" style={{ textAlign: "center", marginTop: 24 }}>
          <button
            onClick={() => window.print()}
            style={{
              background: BROWN, color: "#fff",
              border: "none", borderRadius: 12,
              padding: "12px 28px",
              fontSize: 14, fontWeight: 600, cursor: "pointer",
            }}
          >
            🖨️ 인쇄 / PDF 저장
          </button>
        </div>
      </div>
    </>
  );
}
