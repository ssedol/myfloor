"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getVehicles,
  addVehicle,
  updateFloor,
  renameVehicle,
  deleteVehicle,
  getSeenPatchId,
  markPatchSeen,
  Vehicle,
} from "@/lib/storage";
import {
  getAllAlarms,
  clearAlarm,
  clearExpiredAlarms,
  setAlarm,
  type StoredAlarm,
} from "@/lib/alarmStorage";
import { getLatestPatch } from "@/config/patches";
import { APARTMENT_CONFIG } from "@/config/apartment";
import VehicleCard from "@/components/VehicleCard";
import FloorSelector from "@/components/FloorSelector";
import VehicleFormModal from "@/components/VehicleFormModal";
import Toast from "@/components/Toast";
import KakaoAd from "@/components/KakaoAd";
import FaqSection from "@/components/FaqSection";
import AlarmInfoPopup from "@/components/AlarmInfoPopup";
import InstallPrompt from "@/components/InstallPrompt";
import GuideLink from "@/components/GuideLink";

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [floorTarget, setFloorTarget] = useState<Vehicle | null>(null);
  const [formTarget, setFormTarget] = useState<{ vehicle?: Vehicle } | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [alarms, setAlarms] = useState<Record<string, StoredAlarm>>({});
  const [alarmInfoVehicleId, setAlarmInfoVehicleId] = useState<string | null>(null);

  useEffect(() => {
    setVehicles(getVehicles());
    clearExpiredAlarms();
    setAlarms(getAllAlarms());

    const latest = getLatestPatch();
    if (latest && getSeenPatchId() !== latest.id) {
      markPatchSeen(latest.id);
      showToast(latest.message);
    }
  }, []);

  function showToast(message: string) {
    setToast(message);
    if (navigator.vibrate) navigator.vibrate(100);
  }

  function handleAdd(name: string) {
    const vehicle = addVehicle(name);
    setVehicles(getVehicles());
    setFormTarget(null);
    showToast(`${vehicle.name} 등록됨`);
  }

  function handleRename(vehicle: Vehicle, name: string) {
    renameVehicle(vehicle.id, name);
    setVehicles(getVehicles());
    setFormTarget(null);
  }

  async function handleFloorSelect(floor: string, alarmType?: "slow" | "fast") {
    if (!floorTarget) return;
    const vehicle = floorTarget;
    updateFloor(vehicle.id, floor);
    setVehicles(getVehicles());
    showToast(`${vehicle.name} → ${floor} 저장됨`);
    setFloorTarget(null);

    // 알람 선택 없이 주차 위치만 재등록 시 기존 알람 자동 취소
    if (!alarmType) {
      if (alarms[vehicle.id]) handleAlarmCancel(vehicle.id);
      return;
    }

    if (!("Notification" in window) || !("serviceWorker" in navigator)) return;

    try {
      const permission = await Notification.requestPermission();
      if (permission !== "granted") {
        showToast("알림 권한이 필요해요. 설정에서 허용해주세요.");
        return;
      }

      const reg = await navigator.serviceWorker.ready;
      const existing = await reg.pushManager.getSubscription();
      const sub = existing ?? (await reg.pushManager.subscribe({
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
          type: alarmType,
        }),
      });

      if (!res.ok) throw new Error("서버 오류");
      const { triggerAt } = await res.json();

      const alarm: StoredAlarm = {
        vehicleId: vehicle.id,
        vehicleName: vehicle.name,
        floor,
        type: alarmType,
        triggerAt,
      };
      setAlarm(alarm);
      setAlarms((prev) => ({ ...prev, [vehicle.id]: alarm }));
    } catch (e) {
      console.error(e);
      showToast("알림 설정에 실패했어요.");
    }
  }

  async function handleAlarmCancel(vehicleId: string) {
    clearAlarm(vehicleId);
    setAlarms((prev) => {
      const next = { ...prev };
      delete next[vehicleId];
      return next;
    });
    setAlarmInfoVehicleId(null);
    fetch("/api/push/subscribe", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vehicleId }),
    }).catch(console.error);
  }

  function handleDelete(id: string) {
    const vehicle = vehicles.find((v) => v.id === id);
    deleteVehicle(id);
    if (alarms[id]) {
      clearAlarm(id);
      setAlarms((prev) => { const n = { ...prev }; delete n[id]; return n; });
      fetch("/api/push/subscribe", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ vehicleId: id }),
      }).catch(console.error);
    }
    setVehicles(getVehicles());
    if (vehicle) showToast(`${vehicle.name} 삭제됨`);
  }

  const dismissToast = useCallback(() => setToast(null), []);

  const alarmInfoTarget = alarmInfoVehicleId ? alarms[alarmInfoVehicleId] ?? null : null;

  return (
    <div className="max-w-md mx-auto min-h-[100dvh] flex flex-col">
      <div className="px-5 flex flex-col flex-1">
        <header className="pt-3 pb-2" />

        <a
          href="/install?from=main"
          className="flex items-center justify-between bg-surface rounded-2xl px-4 py-3 mb-2 active:opacity-70 transition-opacity"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0 text-base">
              📲
            </div>
            <div>
              <p className="text-main text-sm font-semibold leading-tight">홈 화면에 설치하셨나요?</p>
              <p className="text-sub text-xs">충전 알림은 설치 후 이용 가능해요</p>
            </div>
          </div>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-sub flex-shrink-0">
            <path d="M6 4l4 4-4 4" />
          </svg>
        </a>

        <GuideLink />

        <main>
          {vehicles.length === 0 ? (
            <div className="flex flex-col items-center py-4 text-center">
              <div className="text-4xl mb-2">🚗</div>
              <p className="text-main font-semibold mb-1">등록된 차량이 없습니다</p>
              <p className="text-sub text-sm mb-4">
                차량을 추가해 주차 층수를 기억하세요
              </p>
              <button
                onClick={() => setFormTarget({})}
                className="px-8 py-3.5 bg-primary text-white text-sm font-semibold rounded-2xl active:bg-primary-dark transition-colors"
              >
                차량 추가하기
              </button>

              <div className="w-full mt-4 text-left space-y-2">
                <p className="text-sub text-xs font-semibold tracking-wide mb-2 text-center">이렇게 사용하세요</p>
                {[
                  { icon: "1", text: "차량 등록 후 주차 층수를 선택해 저장하세요" },
                  { icon: "2", text: "전기차라면 충전 알림을 설정해 시간 맞춰 알림 받으세요" },
                  { icon: "3", text: "공유 버튼으로 가족에게 주차 위치를 전송하세요" },
                ].map(({ icon, text }) => (
                  <div key={icon} className="flex items-start gap-3 bg-surface rounded-2xl px-4 py-2.5">
                    <span className="w-5 h-5 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                      {icon}
                    </span>
                    <p className="text-main text-sm leading-snug">{text}</p>
                  </div>
                ))}

                <div className="flex items-start gap-3 bg-primary/10 border border-primary/30 rounded-2xl px-4 py-2.5 mt-3">
                  <span className="text-base flex-shrink-0 mt-0.5">📲</span>
                  <div>
                    <p className="text-main text-sm font-semibold leading-snug">
                      NFC 태그 · QR로 자동 저장
                      <span className="ml-1.5 align-middle text-[10px] font-bold text-primary-dark bg-primary/20 rounded-full px-1.5 py-0.5">
                        유료
                      </span>
                    </p>
                    <p className="text-sub text-xs leading-snug mt-0.5">
                      층마다 부착된 NFC 스티커를 태그하거나 QR을 스캔하면 층수가 자동으로 저장돼요. 아파트별 추가 기능입니다.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {vehicles.map((v) => (
                <VehicleCard
                  key={v.id}
                  vehicle={v}
                  alarm={alarms[v.id] ?? null}
                  onFloorTap={() => setFloorTarget(v)}
                  onAlarmTap={() => setAlarmInfoVehicleId(v.id)}
                  onDelete={() => handleDelete(v.id)}
                  onRename={() => setFormTarget({ vehicle: v })}
                />
              ))}
              {vehicles.length < APARTMENT_CONFIG.maxVehicles && (
                <button
                  onClick={() => setFormTarget({})}
                  className="w-full py-3.5 border-2 border-dashed border-divider rounded-3xl text-sub text-sm font-medium active:border-primary active:text-primary transition-colors"
                >
                  + 차량 추가
                </button>
              )}
            </div>
          )}
        </main>

        <div className="mt-auto pt-3">
          <div className="rounded-2xl border border-divider overflow-hidden px-3 py-1">
            <FaqSection />
          </div>
          <div className="mt-3 rounded-2xl border border-divider overflow-hidden">
            <p className="text-center text-sub text-[10px] py-1 bg-surface border-b border-divider">광고</p>
            <KakaoAd unit="DAN-Rfsmw2Cumar7lRX2" width={320} height={50} />
            <KakaoAd unit="DAN-09tPLZP1Xguff6vO" width={320} height={100} />
            <KakaoAd unit="DAN-BLLpd0keTfix1qLH" width={320} height={480} />
          </div>
        </div>
      </div>

      {floorTarget && (
        <FloorSelector
          currentFloor={floorTarget.floor}
          onSelect={handleFloorSelect}
          onClose={() => setFloorTarget(null)}
        />
      )}

      {formTarget !== null && (
        <VehicleFormModal
          vehicle={formTarget.vehicle}
          onSubmit={
            formTarget.vehicle
              ? (name) => handleRename(formTarget.vehicle!, name)
              : handleAdd
          }
          onClose={() => setFormTarget(null)}
        />
      )}

      {alarmInfoTarget && (
        <AlarmInfoPopup
          alarm={alarmInfoTarget}
          onCancel={() => handleAlarmCancel(alarmInfoTarget.vehicleId)}
          onClose={() => setAlarmInfoVehicleId(null)}
        />
      )}

      <InstallPrompt />
      {toast && <Toast message={toast} onDismiss={dismissToast} />}
    </div>
  );
}
