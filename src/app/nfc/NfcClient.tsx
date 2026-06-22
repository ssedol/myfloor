"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getVehicles, updateFloor, Vehicle } from "@/lib/storage";
import { APARTMENT_CONFIG } from "@/config/apartment";

const ALL_FLOORS = [
  ...APARTMENT_CONFIG.undergroundFloors,
  ...APARTMENT_CONFIG.aboveFloors,
];

type State =
  | { status: "loading" }
  | { status: "invalid" }
  | { status: "no-vehicles" }
  | { status: "saving"; vehicle: Vehicle; floor: string }
  | { status: "saved"; vehicle: Vehicle; floor: string }
  | { status: "select"; vehicles: Vehicle[]; floor: string };

export default function NfcClient({ floor }: { floor: string | null }) {
  const router = useRouter();
  const [state, setState] = useState<State>({ status: "loading" });

  useEffect(() => {
    if (!floor || !(ALL_FLOORS as readonly string[]).includes(floor)) {
      setState({ status: "invalid" });
      setTimeout(() => router.replace("/"), 1500);
      return;
    }

    const vehicles = getVehicles();

    if (vehicles.length === 0) {
      setState({ status: "no-vehicles" });
      return;
    }

    if (vehicles.length === 1) {
      updateFloor(vehicles[0].id, floor);
      setState({ status: "saving", vehicle: vehicles[0], floor });
      setTimeout(() => {
        setState({ status: "saved", vehicle: vehicles[0], floor });
        if (navigator.vibrate) navigator.vibrate(100);
        setTimeout(() => router.replace("/"), 1500);
      }, 400);
      return;
    }

    setState({ status: "select", vehicles, floor });
  }, [floor, router]);

  function handleSelect(vehicle: Vehicle) {
    if (state.status !== "select") return;
    const { floor } = state;
    updateFloor(vehicle.id, floor);
    setState({ status: "saved", vehicle, floor });
    if (navigator.vibrate) navigator.vibrate(100);
    setTimeout(() => router.replace("/"), 1500);
  }

  return (
    <div className="min-h-[100dvh] bg-app-bg flex flex-col items-center justify-center px-6">
      {state.status === "loading" && (
        <div className="text-sub text-sm">불러오는 중...</div>
      )}

      {state.status === "invalid" && (
        <div className="text-center">
          <div className="text-4xl mb-4">⚠️</div>
          <p className="text-main font-semibold">잘못된 NFC 태그입니다</p>
          <p className="text-sub text-sm mt-1">홈으로 이동합니다</p>
        </div>
      )}

      {state.status === "no-vehicles" && (
        <div className="text-center">
          <div className="text-4xl mb-4">🚗</div>
          <p className="text-main font-semibold mb-1">등록된 차량이 없습니다</p>
          <p className="text-sub text-sm mb-6">먼저 차량을 등록해 주세요</p>
          <button
            onClick={() => router.replace("/")}
            className="px-8 py-3.5 bg-primary text-white text-sm font-semibold rounded-2xl active:bg-primary-dark transition-colors"
          >
            차량 등록하러 가기
          </button>
        </div>
      )}

      {(state.status === "saving" || state.status === "saved") && (
        <div className="text-center">
          <div
            className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 transition-colors duration-300 ${
              state.status === "saved" ? "bg-primary" : "bg-surface"
            }`}
          >
            {state.status === "saved" ? (
              <svg
                className="w-10 h-10 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            ) : (
              <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
            )}
          </div>
          <div className="text-5xl font-bold text-primary mb-2">
            {state.floor}
          </div>
          <p className="text-main font-semibold text-lg">{state.vehicle.name}</p>
          <p className="text-sub text-sm mt-1">
            {state.status === "saved" ? "저장됐어요" : "저장 중..."}
          </p>
        </div>
      )}

      {state.status === "select" && (
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="text-5xl font-bold text-primary mb-2">
              {state.floor}
            </div>
            <p className="text-main font-semibold">어느 차량인가요?</p>
          </div>
          <div className="space-y-3">
            {state.vehicles.map((v) => (
              <button
                key={v.id}
                onClick={() => handleSelect(v)}
                className="w-full py-5 bg-surface rounded-3xl text-main font-semibold text-lg active:bg-primary active:text-white transition-colors"
              >
                {v.name}
              </button>
            ))}
          </div>
          <button
            onClick={() => router.replace("/")}
            className="w-full py-4 text-sub text-sm mt-4"
          >
            취소
          </button>
        </div>
      )}
    </div>
  );
}
