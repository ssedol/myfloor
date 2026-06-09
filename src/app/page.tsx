"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import {
  getVehicles,
  addVehicle,
  updateFloor,
  renameVehicle,
  deleteVehicle,
  Vehicle,
} from "@/lib/storage";
import { APARTMENT_CONFIG } from "@/config/apartment";
import VehicleCard from "@/components/VehicleCard";
import FloorSelector from "@/components/FloorSelector";
import VehicleFormModal from "@/components/VehicleFormModal";
import Toast from "@/components/Toast";

export default function Home() {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [floorTarget, setFloorTarget] = useState<Vehicle | null>(null);
  const [formTarget, setFormTarget] = useState<{ vehicle?: Vehicle } | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setVehicles(getVehicles());
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
      <header className="pt-14 pb-8">
        <Image
          src={APARTMENT_CONFIG.logo}
          alt={APARTMENT_CONFIG.name}
          width={290}
          height={88}
          style={{ width: "100px", height: "auto" }}
          priority
        />
      </header>

      <main>
        {vehicles.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
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
    </div>
  );
}
