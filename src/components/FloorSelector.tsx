"use client";

import { APARTMENT_CONFIG } from "@/config/apartment";

interface Props {
  currentFloor: string | null;
  onSelect: (floor: string) => void;
  onClose: () => void;
}

export default function FloorSelector({
  currentFloor,
  onSelect,
  onClose,
}: Props) {
  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-divider rounded-full mx-auto mb-6" />
        <h2 className="text-main text-lg font-semibold mb-5 text-center">
          층수 선택
        </h2>
        <div className="grid grid-cols-4 gap-3 mb-5">
          {APARTMENT_CONFIG.floors.map((floor) => (
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
        <button
          onClick={onClose}
          className="w-full py-4 rounded-2xl border border-divider text-sub text-sm"
        >
          취소
        </button>
      </div>
    </div>
  );
}
