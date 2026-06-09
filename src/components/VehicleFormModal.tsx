"use client";

import { useState } from "react";
import { Vehicle } from "@/lib/storage";

interface Props {
  vehicle?: Vehicle;
  onSubmit: (name: string) => void;
  onClose: () => void;
}

export default function VehicleFormModal({ vehicle, onSubmit, onClose }: Props) {
  const [name, setName] = useState(vehicle?.name ?? "");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit(name.trim());
  }

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center px-5"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/40" />
      <div
        className="relative w-full bg-white rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-main text-lg font-semibold mb-5">
          {vehicle ? "차량 이름 변경" : "차량 추가"}
        </h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="예: 아빠차, 엄마차"
            autoFocus
            className="w-full bg-surface rounded-2xl px-4 py-4 text-main text-base outline-none placeholder:text-sub mb-5"
          />
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-4 rounded-2xl border border-divider text-sub text-sm font-medium"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex-1 py-4 rounded-2xl bg-primary text-white text-sm font-semibold disabled:opacity-40 transition-opacity"
            >
              {vehicle ? "변경" : "추가"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
