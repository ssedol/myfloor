import "server-only";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.KV_REST_API_URL!,
  token: process.env.KV_REST_API_TOKEN!,
});

export interface ParkingAlarm {
  id: string;
  vehicleId: string;
  subscription: {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  vehicleName: string;
  floor: string;
  type: "slow" | "fast";
  triggerAt: number; // Unix ms
}

// triggerAt을 score로 사용하는 sorted set
export const ALARM_KEY = "parking:alarms";

// Upstash 클라이언트는 읽을 때 JSON을 자동으로 객체로 역직렬화한다.
// (저장된 member가 유효한 JSON 문자열이면 자동 parse됨)
// 따라서 이미 객체인 경우와 문자열인 경우를 모두 안전하게 처리한다.
export function parseAlarm(item: unknown): ParkingAlarm {
  return typeof item === "string"
    ? (JSON.parse(item) as ParkingAlarm)
    : (item as ParkingAlarm);
}
