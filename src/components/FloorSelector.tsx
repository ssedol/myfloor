"use client";

import { useState, useRef, useEffect } from "react";
import { APARTMENT_CONFIG } from "@/config/apartment";

interface Props {
  currentFloor: string | null;
  onSelect: (floor: string, alarmType?: "slow" | "fast") => void;
  onClose: () => void;
}

function FloorGrid({
  floors,
  currentFloor,
  onSelect,
}: {
  floors: readonly string[];
  currentFloor: string | null;
  onSelect: (floor: string) => void;
}) {
  return (
    <div className="grid grid-cols-4 gap-3">
      {floors.map((floor) => {
        const isActive =
          floor === currentFloor || currentFloor?.startsWith(floor + " ·");
        return (
          <button
            key={floor}
            onClick={() => onSelect(floor)}
            className={`py-4 rounded-2xl text-base font-semibold transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "bg-surface text-main active:bg-primary/20"
            }`}
          >
            {floor}
          </button>
        );
      })}
    </div>
  );
}

const ALARM_OPTIONS = [
  { type: "slow" as const, emoji: "🔌", label: "완속충전", desc: "13시간 후 알림" },
  { type: "fast" as const, emoji: "⚡", label: "급속충전", desc: "45분 후 알림" },
];

export default function FloorSelector({ currentFloor, onSelect, onClose }: Props) {
  const [directMode, setDirectMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [pendingFloor, setPendingFloor] = useState<string | null>(null);
  const [locationMode, setLocationMode] = useState(false);
  const [locationValue, setLocationValue] = useState("");
  const [alarmMode, setAlarmMode] = useState(false);
  const [selectedAlarm, setSelectedAlarm] = useState<"slow" | "fast" | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const locationRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (directMode) inputRef.current?.focus();
  }, [directMode]);

  useEffect(() => {
    if (locationMode) locationRef.current?.focus();
  }, [locationMode]);

  function handleFloorPick(floor: string) {
    setPendingFloor(floor);
    setLocationValue("");
    setLocationMode(false);
    setAlarmMode(false);
    setSelectedAlarm(null);
  }

  function handleSave() {
    if (!pendingFloor) return;
    const loc = locationValue.trim();
    const floor = loc ? `${pendingFloor} · ${loc}` : pendingFloor;
    onSelect(floor, selectedAlarm ?? undefined);
  }

  function handleDirectConfirm() {
    const val = inputValue.trim();
    if (val) onSelect(val);
  }

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-divider rounded-full mx-auto mb-6" />

        {directMode ? (
          <>
            <h2 className="text-main text-lg font-semibold mb-5 text-center">직접 입력</h2>
            <input
              ref={inputRef}
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleDirectConfirm()}
              placeholder="예: B3 A-12, 마트 1층, 옥상"
              className="w-full bg-surface rounded-2xl px-4 py-4 text-main text-base outline-none placeholder:text-sub/50 mb-4"
            />
            <button
              onClick={handleDirectConfirm}
              disabled={!inputValue.trim()}
              className="w-full py-4 rounded-2xl bg-primary text-white font-semibold text-base mb-3 disabled:opacity-30"
            >
              저장
            </button>
            <button
              onClick={() => setDirectMode(false)}
              className="w-full py-4 rounded-2xl border border-divider text-sub text-sm"
            >
              돌아가기
            </button>
          </>
        ) : pendingFloor ? (
          <>
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-primary mb-1">{pendingFloor}</div>
              <p className="text-sub text-sm">충전 알림과 세부 위치를 추가할 수 있어요 (선택사항)</p>
            </div>

            {/* 저장 */}
            <button
              onClick={handleSave}
              className="w-full py-4 rounded-2xl bg-primary text-white font-semibold text-base mb-4"
            >
              저장
            </button>

            {/* 세부 위치 */}
            {locationMode ? (
              <input
                ref={locationRef}
                type="text"
                value={locationValue}
                onChange={(e) => setLocationValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSave()}
                placeholder="예: A-12, 기둥 34번, 엘리베이터 앞"
                className="w-full bg-surface rounded-2xl px-4 py-4 text-main text-base outline-none placeholder:text-sub/50 mb-3"
              />
            ) : (
              <button
                onClick={() => setLocationMode(true)}
                className="w-full py-4 rounded-2xl border border-divider text-sub text-sm mb-3"
              >
                + 세부 위치 추가
              </button>
            )}

            {/* 전기차 충전 알림 */}
            {alarmMode ? (
              <div className="mb-3">
                <div className="grid grid-cols-2 gap-3">
                  {ALARM_OPTIONS.map(({ type, emoji, label, desc }) => (
                    <button
                      key={type}
                      onClick={() => setSelectedAlarm(selectedAlarm === type ? null : type)}
                      className={`py-3 rounded-2xl text-sm transition-colors ${
                        selectedAlarm === type
                          ? "bg-primary text-white"
                          : "bg-surface text-main active:bg-primary/20"
                      }`}
                    >
                      <div className="font-semibold">{emoji} {label}</div>
                      <div className={`text-xs mt-0.5 ${selectedAlarm === type ? "text-white/70" : "text-sub"}`}>
                        {desc}
                      </div>
                    </button>
                  ))}
                </div>
                <p className="text-sub text-xs text-center mt-2 leading-snug">
                  홈 화면에 설치된 앱에서만 알림이 발송돼요
                  <br />
                  <span className="text-sub/70">iOS: Safari → 공유 → 홈 화면에 추가</span>
                </p>
              </div>
            ) : (
              <button
                onClick={() => setAlarmMode(true)}
                className="w-full py-4 rounded-2xl border border-divider text-sub text-sm mb-3"
              >
                ⚡ 전기차 충전 알림 설정
              </button>
            )}

            <button
              onClick={() => setPendingFloor(null)}
              className="w-full py-3 text-sub text-sm"
            >
              돌아가기
            </button>
          </>
        ) : (
          <>
            <h2 className="text-main text-lg font-semibold mb-5 text-center">층수 선택</h2>

            <p className="text-sub text-xs font-semibold mb-3 tracking-wide">지상</p>
            <FloorGrid
              floors={APARTMENT_CONFIG.aboveFloors}
              currentFloor={currentFloor}
              onSelect={handleFloorPick}
            />

            <p className="text-sub text-xs font-semibold mt-5 mb-3 tracking-wide">지하</p>
            <FloorGrid
              floors={APARTMENT_CONFIG.undergroundFloors}
              currentFloor={currentFloor}
              onSelect={handleFloorPick}
            />

            <button
              onClick={() => { setInputValue(""); setDirectMode(true); }}
              className="w-full py-4 rounded-2xl bg-surface text-main text-sm font-semibold mt-5"
            >
              ✏️ 직접 입력
            </button>

            <button
              onClick={onClose}
              className="w-full py-4 rounded-2xl border border-divider text-sub text-sm mt-3"
            >
              취소
            </button>
          </>
        )}
      </div>
    </div>
  );
}
