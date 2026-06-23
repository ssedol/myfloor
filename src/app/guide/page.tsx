"use client";

export const dynamic = "force-static";

const BROWN = "#40342E";
const GREEN = "#9BC72E";
const BG = "#F5F3EF";
const SURFACE = "#ECEAE4";
const SUB = "#8B7B72";
const DIVIDER = "#D5CEC6";
const WHITE = "#FFFFFF";

/* 실제 앱의 차량 카드를 그대로 축소한 미니 목업 (디자인 통일감) */
function MiniCard({
  name,
  floor,
  empty,
}: {
  name: string;
  floor?: string;
  empty?: boolean;
}) {
  return (
    <div
      style={{
        background: BROWN,
        borderRadius: 18,
        padding: "12px 14px",
        width: "100%",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ color: WHITE, fontWeight: 600, fontSize: 13 }}>{name}</span>
        <div style={{ display: "flex", gap: 6, opacity: 0.4 }}>
          <span style={{ color: WHITE, fontSize: 11 }}>↗</span>
          <span style={{ color: WHITE, fontSize: 11 }}>✎</span>
          <span style={{ color: WHITE, fontSize: 11 }}>🗑</span>
        </div>
      </div>
      {empty ? (
        <div style={{ color: "rgba(255,255,255,0.3)", fontSize: 22, fontWeight: 600, padding: "4px 0" }}>
          미저장
        </div>
      ) : (
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ color: GREEN, fontSize: 34, fontWeight: 800, lineHeight: 1 }}>{floor}</span>
          <span style={{ color: "rgba(255,255,255,0.4)", fontSize: 10, textAlign: "right", lineHeight: 1.3 }}>
            마지막 저장
            <br />
            오늘 오후 3:44
          </span>
        </div>
      )}
    </div>
  );
}

function StepRow({
  n,
  title,
  desc,
  visual,
  last,
}: {
  n: number;
  title: string;
  desc: string;
  visual: React.ReactNode;
  last?: boolean;
}) {
  return (
    <div style={{ display: "flex", gap: 14, alignItems: "stretch" }}>
      {/* 타임라인 */}
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
        <div
          style={{
            width: 30,
            height: 30,
            borderRadius: 15,
            background: GREEN,
            color: WHITE,
            fontWeight: 800,
            fontSize: 14,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          {n}
        </div>
        {!last && <div style={{ width: 2, flex: 1, background: DIVIDER, marginTop: 4 }} />}
      </div>

      {/* 본문 */}
      <div style={{ flex: 1, paddingBottom: last ? 0 : 22 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: BROWN, marginBottom: 3 }}>{title}</div>
        <div style={{ fontSize: 13, color: SUB, lineHeight: 1.5, marginBottom: 10 }}>{desc}</div>
        <div>{visual}</div>
      </div>
    </div>
  );
}

function FeatureChip({ icon, label }: { icon: string; label: string }) {
  return (
    <div
      style={{
        flex: 1,
        background: BG,
        borderRadius: 14,
        padding: "12px 8px",
        textAlign: "center",
      }}
    >
      <div style={{ fontSize: 20, marginBottom: 5 }}>{icon}</div>
      <div style={{ fontSize: 11, fontWeight: 600, color: BROWN, lineHeight: 1.3 }}>{label}</div>
    </div>
  );
}

export default function GuidePage() {
  return (
    <>
      <style>{`
        * { box-sizing: border-box; }
        body { background: ${SURFACE}; overflow-x: hidden; }
        .poster-wrap { max-width: 440px; margin: 0 auto; padding: 28px 16px 40px; }
      `}</style>

      <div
        className="poster-wrap"
        style={{
          fontFamily: '"Pretendard Variable", Pretendard, -apple-system, BlinkMacSystemFont, sans-serif',
        }}
      >
        {/* 한 장의 포스터 카드 */}
        <div
          style={{
            background: WHITE,
            borderRadius: 28,
            overflow: "hidden",
            boxShadow: "0 12px 40px rgba(64,52,46,0.12)",
          }}
        >
          {/* 헤더 밴드 */}
          <div style={{ background: BROWN, padding: "28px 24px 26px", textAlign: "center" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 6,
                marginBottom: 12,
              }}
            >
              <span style={{ color: GREEN, fontSize: 22, fontWeight: 800, letterSpacing: "-0.03em" }}>몇층</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 13, fontWeight: 500 }}>에 주차했지...?</span>
            </div>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: WHITE,
                margin: 0,
                lineHeight: 1.35,
                letterSpacing: "-0.03em",
              }}
            >
              주차한 층,
              <br />
              다시는 헤매지 마세요
            </h1>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, marginTop: 10, lineHeight: 1.5 }}>
              차 세운 층을 한 번 탭으로 저장하는
              <br />
              가장 간단한 방법
            </p>
          </div>

          {/* 본문 */}
          <div style={{ padding: "26px 22px 28px" }}>
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: GREEN,
                letterSpacing: "0.08em",
                marginBottom: 18,
              }}
            >
              HOW TO USE · 이렇게 사용해요
            </div>

            <StepRow
              n={1}
              title="차량을 등록해요"
              desc="차 이름만 입력하면 끝. 가족 차량까지 최대 3대 등록할 수 있어요."
              visual={<MiniCard name="테슬라" empty />}
            />
            <StepRow
              n={2}
              title="주차한 층을 저장해요"
              desc="카드를 탭하고 층수를 고르면 저장 완료. 앱을 닫아도 그대로 남아있어요."
              visual={<MiniCard name="테슬라" floor="B3" />}
            />
            <StepRow
              n={3}
              title="전기차 충전 알림도 받아요"
              desc="층수 저장 후 충전 유형을 선택하면 시간 맞춰 알려드려요. 완속은 13시간, 급속은 45분 후 알림이 와요."
              visual={
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <div
                    style={{
                      background: BG,
                      borderRadius: 14,
                      padding: "10px 14px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <span style={{ color: GREEN, fontSize: 28, fontWeight: 800, lineHeight: 1 }}>B3</span>
                    <span style={{ fontSize: 12, color: SUB }}>충전 알림 설정</span>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                    <div
                      style={{
                        background: BROWN,
                        borderRadius: 12,
                        padding: "10px 8px",
                        textAlign: "center",
                        color: WHITE,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700 }}>🔌 완속충전</div>
                      <div style={{ fontSize: 11, opacity: 0.65, marginTop: 3 }}>13시간 후 알림</div>
                    </div>
                    <div
                      style={{
                        background: SURFACE,
                        borderRadius: 12,
                        padding: "10px 8px",
                        textAlign: "center",
                        color: BROWN,
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 700 }}>⚡ 급속충전</div>
                      <div style={{ fontSize: 11, color: SUB, marginTop: 3 }}>45분 후 알림</div>
                    </div>
                  </div>
                </div>
              }
            />
            <StepRow
              n={4}
              title="가족과 공유해요"
              desc="공유 버튼을 누르면 카카오톡으로 위치 전송. 받은 사람도 한 번에 확인해요."
              last
              visual={
                <div
                  style={{
                    background: BG,
                    borderRadius: 14,
                    padding: "12px 14px",
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                  }}
                >
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: GREEN,
                      color: WHITE,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      fontSize: 15,
                      flexShrink: 0,
                    }}
                  >
                    ↗
                  </div>
                  <div style={{ fontSize: 13, color: BROWN, lineHeight: 1.4 }}>
                    <b>테슬라 B3</b>에 주차했어요 🚗
                    <br />
                    <span style={{ color: SUB, fontSize: 12 }}>링크로 위치를 저장하세요</span>
                  </div>
                </div>
              }
            />

            {/* 특징 칩 */}
            <div style={{ display: "flex", gap: 8, marginTop: 24 }}>
              <FeatureChip icon="💾" label="앱 닫아도 저장 유지" />
              <FeatureChip icon="👨‍👩‍👧" label="가족과 위치 공유" />
              <FeatureChip icon="⚡" label="충전 알림" />
              <FeatureChip icon="✨" label="무료" />
            </div>

            {/* 마무리 */}
            <div
              style={{
                marginTop: 22,
                paddingTop: 18,
                borderTop: `1px solid ${DIVIDER}`,
                textAlign: "center",
              }}
            >
              <p style={{ fontSize: 13, color: SUB, lineHeight: 1.6, margin: 0 }}>
                홈 화면에 추가해두면
                <br />
                매번 더 빠르게 열 수 있어요 📱
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
