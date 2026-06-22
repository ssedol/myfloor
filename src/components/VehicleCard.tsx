"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/storage";
import { formatUpdatedAt } from "@/lib/utils";

interface Props {
  vehicle: Vehicle;
  onFloorTap: () => void;
  onDelete: () => void;
  onRename: () => void;
}

function EditIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 2.5l2.5 2.5L6 14.5H3.5V12L13 2.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 5h14M6 5V4h6v1M7 8v6M11 8v6M3 5l1 10h10l1-10" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M13 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM5 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4zM13 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
      <path d="M7 8.5l4-2M7 9.5l4 2" />
    </svg>
  );
}

export default function VehicleCard({ vehicle, onFloorTap, onDelete, onRename }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDeleteTap() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete();
  }

  async function handleShare() {
    if (!vehicle.floor) return;
    const url = `${window.location.origin}/park?floor=${vehicle.floor}`;
    const text = `${vehicle.name} ${vehicle.floor}에 주차했어요 🚗\n아래 링크로 위치를 저장하세요`;

    if (navigator.share) {
      await navigator.share({ title: "몇층", text, url }).catch(() => {});
    } else {
      await navigator.clipboard.writeText(`${text}\n${url}`);
    }
  }

  return (
    <div className="bg-main rounded-3xl p-4">
      {/* 행 1: 이름 + 아이콘 */}
      <div className="flex items-center justify-between mb-1">
        <span className="text-white font-semibold text-base">{vehicle.name}</span>
        <div className="flex gap-2">
          {vehicle.floor && (
            <button
              onClick={handleShare}
              className="text-white/40 p-1.5 rounded-xl active:bg-white/10 transition-colors"
              aria-label="공유"
            >
              <ShareIcon />
            </button>
          )}
          <button
            onClick={onRename}
            className="text-white/40 p-1.5 rounded-xl active:bg-white/10 transition-colors"
            aria-label="이름 변경"
          >
            <EditIcon />
          </button>
          <button
            onClick={handleDeleteTap}
            className={`p-1.5 rounded-xl active:bg-white/10 transition-colors ${
              confirmDelete ? "text-red-400" : "text-white/40"
            }`}
            aria-label={confirmDelete ? "한 번 더 누르면 삭제" : "차량 삭제"}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      {/* 행 2: 층수 + 타임스탬프 */}
      <button
        onClick={onFloorTap}
        className="w-full flex items-center justify-between active:opacity-70 transition-opacity"
        aria-label="층수 변경"
      >
        {vehicle.floor ? (
          <>
            <span className="text-4xl font-bold text-primary leading-none">
              {vehicle.floor}
            </span>
            <span className="text-white/40 text-xs text-right leading-snug">
              마지막 저장<br />{formatUpdatedAt(vehicle.updatedAt)}
            </span>
          </>
        ) : (
          <span className="text-2xl font-medium text-white/30">미저장</span>
        )}
      </button>

      {confirmDelete && (
        <p className="text-center text-xs text-red-400 mt-2">
          한 번 더 누르면 삭제됩니다
        </p>
      )}
    </div>
  );
}
