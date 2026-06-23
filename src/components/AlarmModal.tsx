"use client";

import { useState } from "react";
import type { Vehicle } from "@/lib/storage";
import { setAlarm, type StoredAlarm } from "@/lib/alarmStorage";

interface Props {
  vehicle: Vehicle;
  floor: string;
  onClose: () => void;
  onAlarmSet: (alarm: StoredAlarm) => void;
}

type AlarmType = "none" | "slow" | "fast";

export default function AlarmModal({ vehicle, floor, onClose, onAlarmSet }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSelect(type: AlarmType) {
    if (type === "none") {
      onClose();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        setError("알림 권한이 거부됐어요. 설정에서 허용해주세요.");
        setLoading(false);
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      const sub =
        existing ??
        (await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
        }));

      const subJson = sub.toJSON() as {
        endpoint: string;
        keys: { p256dh: string; auth: string };
      };

      const res = await fetch("/api/push/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subscription: subJson,
          vehicleId: vehicle.id,
          vehicleName: vehicle.name,
          floor,
          type,
        }),
      });

      if (!res.ok) throw new Error("서버 오류");

      const { triggerAt } = await res.json();

      const alarm: StoredAlarm = {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        floor,
        type,
        triggerAt,
      };
      setAlarm(alarm);
      onAlarmSet(alarm);
      onClose();
    } catch (e) {
      console.error(e);
      setError("알림 설정에 실패했어요. 다시 시도해주세요.");
      setLoading(false);
    }
  }

  const options: { type: AlarmType; label: string; desc: string; emoji: string }[] = [
    { type: "slow", label: "완속충전", desc: "13시간 후 알림", emoji: "🔌" },
    { type: "fast", label: "급속충전", desc: "45분 후 알림 (1h - 15분)", emoji: "⚡" },
    { type: "none", label: "알림 없음", desc: "이번엔 넘어갈게요", emoji: "✕" },
  ];

  return (
    <div className="fixed inset-0 z-40" onClick={onClose}>
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="absolute bottom-0 left-0 right-0 bg-white rounded-t-3xl p-6 max-w-md mx-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-10 h-1 bg-divider rounded-full mx-auto mb-6" />

        <div className="text-center mb-5">
          <p className="text-main font-bold text-lg">⏰ 충전 알림 설정</p>
          <p className="text-sub text-sm mt-1">{vehicle.name} · {floor}</p>
        </div>

        {loading ? (
          <div className="text-center py-6">
            <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-sub text-sm">알림 설정 중...</p>
          </div>
        ) : (
          <div className="space-y-3">
            {error && (
              <p className="text-red-500 text-sm text-center bg-red-50 rounded-2xl px-4 py-3">
                {error}
              </p>
            )}
            {options.map(({ type, label, desc, emoji }) => (
              <button
                key={type}
                onClick={() => handleSelect(type)}
                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-colors ${
                  type === "none"
                    ? "border border-divider text-sub active:bg-surface"
                    : "bg-surface text-main active:bg-primary/20"
                }`}
              >
                <span className="text-2xl w-8 text-center">{emoji}</span>
                <div className="text-left">
                  <p className="font-semibold text-sm">{label}</p>
                  <p className="text-sub text-xs">{desc}</p>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
