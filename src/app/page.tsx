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
import { getLatestPatch } from "@/config/patches";
import { APARTMENT_CONFIG } from "@/config/apartment";
import VehicleCard from "@/components/VehicleCard";
import FloorSelector from "@/components/FloorSelector";
import VehicleFormModal from "@/components/VehicleFormModal";
import Toast from "@/components/Toast";
import AdBanner from "@/components/AdBanner";
import FaqSection from "@/components/FaqSection";

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [floorTarget, setFloorTarget] = useState<Vehicle | null>(null);
  const [formTarget, setFormTarget] = useState<{ vehicle?: Vehicle } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setVehicles(getVehicles());

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

  function handleFloorSelect(floor: string) {
    if (!floorTarget) return;
    updateFloor(floorTarget.id, floor);
    setVehicles(getVehicles());
    showToast(`${floorTarget.name} → ${floor} 저장됨`);
    setFloorTarget(null);
  }

  function handleDelete(id: string) {
    const vehicle = vehicles.find((v) => v.id === id);
    deleteVehicle(id);
    setVehicles(getVehicles());
    if (vehicle) showToast(`${vehicle.name} 삭제됨`);
  }

  const dismissToast = useCallback(() => setToast(null), []);

  return (
    <div className="max-w-md mx-auto px-5">
      <header className="pt-14 pb-8" />

      <main>
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center py-16 text-center">
            <div className="text-5xl mb-5">🚗</div>
            <p className="text-main font-semibold mb-2">등록된 차량이 없습니다</p>
            <p className="text-sub text-sm mb-8">
              차량을 추가해 주차 층수를 기억하세요
            </p>
            <button
              onClick={() => setFormTarget({})}
              className="px-8 py-4 bg-primary text-white text-sm font-semibold rounded-2xl active:bg-primary-dark transition-colors"
            >
              차량 추가하기
            </button>

            <div className="w-full mt-12 text-left space-y-3">
              <p className="text-sub text-xs font-semibold tracking-wide mb-4 text-center">이렇게 사용하세요</p>
              {[
                { icon: "1", text: "차량 등록 후 층수를 선택해 저장하세요" },
                { icon: "2", text: "NFC 스티커를 태그하면 층수가 자동으로 저장됩니다" },
                { icon: "3", text: "공유 버튼으로 가족에게 주차 위치를 전송하세요" },
              ].map(({ icon, text }) => (
                <div key={icon} className="flex items-start gap-3 bg-surface rounded-2xl px-4 py-3">
                  <span className="w-6 h-6 rounded-full bg-primary text-white text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                    {icon}
                  </span>
                  <p className="text-main text-sm leading-snug">{text}</p>
                </div>
              ))}
            </div>

          </div>
        ) : (
          <div className="space-y-4 pb-10">
            {vehicles.map((v) => (
              <VehicleCard
                key={v.id}
                vehicle={v}
                onFloorTap={() => setFloorTarget(v)}
                onDelete={() => handleDelete(v.id)}
                onRename={() => setFormTarget({ vehicle: v })}
              />
            ))}
            {vehicles.length < APARTMENT_CONFIG.maxVehicles && (
              <button
                onClick={() => setFormTarget({})}
                className="w-full py-5 border-2 border-dashed border-divider rounded-3xl text-sub text-sm font-medium active:border-primary active:text-primary transition-colors"
              >
                + 차량 추가
              </button>
            )}
          </div>
        )}
      </main>

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

      {toast && <Toast message={toast} onDismiss={dismissToast} />}

      <FaqSection />
      <div className="pb-6">
        <AdBanner />
      </div>
    </div>
  );
}
