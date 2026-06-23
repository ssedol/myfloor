"use client";

import { useState } from "react";
import type { StoredAlarm } from "@/lib/alarmStorage";

interface Props {
  alarm: StoredAlarm;
  onCancel: () => Promise<void>;
  onClose: () => void;
}

function formatScheduledTime(triggerAt: number): string {
  return new Date(triggerAt).toLocaleString("ko-KR", {
    timeZone: "Asia/Seoul",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatRemaining(triggerAt: number): string {
  const diff = triggerAt - Date.now();
  if (diff <= 0) return "곧 알림이 발송돼요";
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  if (h > 0) return `약 ${h}시간 ${m}분 후`;
  return `약 ${m}분 후`;
}

export default function AlarmInfoPopup({ alarm, onCancel, onClose }: Props) {
  const [cancelling, setCancelling] = useState(false);

  async function handleCancel() {
    setCancelling(true);
    await onCancel();
  }

  const typeLabel = alarm.type === "slow" ? "완속충전" : "급속충전";
  const typeEmoji = alarm.type === "slow" ? "🔌" : "⚡";

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-divider rounded-full mx-auto mb-6" />

        <div className="text-center mb-5">
          <p className="text-main font-bold text-lg">⏰ 충전 알림</p>
          <p className="text-sub text-sm mt-1">{alarm.vehicleName}</p>
        </div>

        <div className="bg-surface rounded-2xl p-4 space-y-3 mb-5">
          <div className="flex items-center justify-between">
            <span className="text-sub text-sm">주차 층수</span>
            <span className="text-main font-bold text-lg leading-none">{alarm.floor}</span>
          </div>
          <div className="h-px bg-divider" />
          <div className="flex items-center justify-between">
            <span className="text-sub text-sm">충전 유형</span>
            <span className="text-main font-semibold text-sm">{typeEmoji} {typeLabel}</span>
          </div>
          <div className="h-px bg-divider" />
          <div className="flex items-center justify-between">
            <span className="text-sub text-sm">알림 예정</span>
            <span className="text-main font-semibold text-sm text-right">
              {formatScheduledTime(alarm.triggerAt)}
            </span>
          </div>
          <div className="h-px bg-divider" />
          <div className="flex items-center justify-between">
            <span className="text-sub text-sm">남은 시간</span>
            <span className="text-primary font-semibold text-sm">
              {formatRemaining(alarm.triggerAt)}
            </span>
          </div>
        </div>

        <button
          onClick={handleCancel}
          disabled={cancelling}
          className="w-full py-4 rounded-2xl bg-red-50 text-red-500 font-semibold text-sm active:bg-red-100 transition-colors disabled:opacity-50"
        >
          {cancelling ? "취소 중..." : "알림 취소"}
        </button>
      </div>
    </div>
  );
}
