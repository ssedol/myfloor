"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getVehicles, updateFloor, Vehicle } from "@/lib/storage";
import InAppBrowserGuide from "@/components/InAppBrowserGuide";

interface Props {
  floor: string | null;
}

export default function ParkClient({ floor }: Props) {
  const router = useRouter();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [savedVehicleName, setSavedVehicleName] = useState("");

  function doSave(vehicle: Vehicle) {
    if (!floor) return;
    updateFloor(vehicle.id, floor);
    setSavedVehicleName(vehicle.name);
    setSaved(true);
    if (navigator.vibrate) navigator.vibrate(200);
    setTimeout(() => router.replace("/"), 1800);
  }

  useEffect(() => {
    const data = getVehicles();
    setVehicles(data);
    if (data.length === 1 && floor) {
      doSave(data[0]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!floor) {
    return (
      <>
        <InAppBrowserGuide />
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
          <p className="text-4xl mb-4">❓</p>
          <p className="text-main font-semibold mb-2">유효하지 않은 태그입니다</p>
          <p className="text-sub text-sm mb-8">NFC 태그를 다시 확인해주세요</p>
          <button
            onClick={() => router.replace("/")}
            className="px-8 py-4 bg-primary text-white text-sm font-semibold rounded-2xl"
          >
            메인으로
          </button>
        </div>
      </>
    );
  }

  if (saved) {
    return (
      <>
        <InAppBrowserGuide />
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
          <div className="text-7xl font-bold text-primary mb-4">{floor}</div>
          <p className="text-main font-semibold text-lg mb-2">{savedVehicleName}</p>
          <p className="text-sub text-sm">저장 완료 ✓</p>
        </div>
      </>
    );
  }

  if (vehicles.length === 0) {
    return (
      <>
        <InAppBrowserGuide />
        <div className="flex flex-col items-center justify-center min-h-screen px-8 text-center">
          <div className="text-6xl font-bold text-primary mb-3">{floor}</div>
          <p className="text-sub text-sm mb-8">차량을 먼저 등록해주세요</p>
          <button
            onClick={() => router.replace("/")}
            className="px-8 py-4 bg-primary text-white text-sm font-semibold rounded-2xl"
          >
            차량 등록하러 가기
          </button>
        </div>
      </>
    );
  }

  function handleSave() {
    if (!selectedId) return;
    const vehicle = vehicles.find((v) => v.id === selectedId);
    if (vehicle) doSave(vehicle);
  }

  return (
    <div className="flex flex-col min-h-screen px-5 pt-16 pb-10 max-w-md mx-auto">
      <InAppBrowserGuide />
      <div className="text-center mb-10">
        <div className="text-7xl font-bold text-primary mb-3">{floor}</div>
        <p className="text-main text-lg font-semibold">에 주차하셨나요?</p>
      </div>

      <p className="text-sub text-sm mb-4 font-medium">어느 차량에 저장할까요?</p>

      <div className="space-y-3 mb-10">
        {vehicles.map((v) => (
          <button
            key={v.id}
            onClick={() => setSelectedId(v.id)}
            className={`w-full py-5 rounded-2xl text-left px-5 border-2 transition-colors ${
              selectedId === v.id
                ? "border-primary bg-white text-main"
                : "border-divider bg-surface text-main"
            }`}
          >
            <span className="font-semibold">{v.name}</span>
            {v.floor && (
              <span className="text-sub text-sm ml-2">현재 {v.floor}</span>
            )}
          </button>
        ))}
      </div>

      <div className="mt-auto flex gap-3">
        <button
          onClick={() => router.replace("/")}
          className="flex-1 py-4 rounded-2xl border border-divider text-sub text-sm font-medium"
        >
          취소
        </button>
        <button
          onClick={handleSave}
          disabled={!selectedId}
          className="flex-1 py-4 rounded-2xl bg-primary text-white text-sm font-semibold disabled:opacity-40 transition-opacity"
        >
          저장
        </button>
      </div>
    </div>
  );
}
