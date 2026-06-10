"use client";

import { useState, useRef, useEffect } from "react";
import { APARTMENT_CONFIG } from "@/config/apartment";

interface Props {
  currentFloor: string | null;
  onSelect: (floor: string) => void;
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
      {floors.map((floor) => (
        <button
          key={floor}
          onClick={() => onSelect(floor)}
          className={`py-4 rounded-2xl text-base font-semibold transition-colors ${
            floor === currentFloor
              ? "bg-primary text-white"
              : "bg-surface text-main active:bg-primary/20"
          }`}
        >
          {floor}
        </button>
      ))}
    </div>
  );
}

export default function FloorSelector({ currentFloor, onSelect, onClose }: Props) {
  const [directMode, setDirectMode] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (directMode) inputRef.current?.focus();
  }, [directMode]);

  function handleDirectConfirm() {
    const val = inputValue.trim();
    if (val) {
      onSelect(val);
    }
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
        ) : (
          <>
            <h2 className="text-main text-lg font-semibold mb-5 text-center">층수 선택</h2>

            <p className="text-sub text-xs font-semibold mb-3 tracking-wide">지상</p>
            <FloorGrid
              floors={APARTMENT_CONFIG.aboveFloors}
              currentFloor={currentFloor}
              onSelect={onSelect}
            />

            <p className="text-sub text-xs font-semibold mt-5 mb-3 tracking-wide">지하</p>
            <FloorGrid
              floors={APARTMENT_CONFIG.undergroundFloors}
              currentFloor={currentFloor}
              onSelect={onSelect}
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
