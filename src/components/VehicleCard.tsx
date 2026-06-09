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
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M13 2.5l2.5 2.5L6 14.5H3.5V12L13 2.5z" />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 18 18"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 5h14M6 5V4h6v1M7 8v6M11 8v6M3 5l1 10h10l1-10" />
    </svg>
  );
}

export default function VehicleCard({
  vehicle,
  onFloorTap,
  onDelete,
  onRename,
}: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  function handleDeleteTap() {
    if (!confirmDelete) {
      setConfirmDelete(true);
      setTimeout(() => setConfirmDelete(false), 3000);
      return;
    }
    onDelete();
  }

  return (
    <div className="bg-surface rounded-3xl p-5 border border-divider">
      <div className="flex items-center justify-between mb-1">
        <span className="text-main font-semibold text-base">{vehicle.name}</span>
        <div className="flex gap-2">
          <button
            onClick={onRename}
            className="text-sub p-1.5 rounded-xl active:bg-divider transition-colors"
            aria-label="이름 변경"
          >
            <EditIcon />
          </button>
          <button
            onClick={handleDeleteTap}
            className={`p-1.5 rounded-xl active:bg-divider transition-colors ${
              confirmDelete ? "text-red-400" : "text-sub"
            }`}
            aria-label={confirmDelete ? "한 번 더 누르면 삭제" : "차량 삭제"}
          >
            <TrashIcon />
          </button>
        </div>
      </div>

      <button
        onClick={onFloorTap}
        className="w-full py-6 flex flex-col items-center active:opacity-70 transition-opacity"
        aria-label="층수 변경"
      >
        {vehicle.floor ? (
          <>
            <span className="text-6xl font-bold text-primary leading-none">
              {vehicle.floor}
            </span>
            <span className="text-sub text-xs mt-3">
              마지막 저장: {formatUpdatedAt(vehicle.updatedAt)}
            </span>
          </>
        ) : (
          <span className="text-3xl font-medium text-sub">미저장</span>
        )}
      </button>

      {confirmDelete && (
        <p className="text-center text-xs text-red-400 -mt-2 pb-1">
          한 번 더 누르면 삭제됩니다
        </p>
      )}
    </div>
  );
}
