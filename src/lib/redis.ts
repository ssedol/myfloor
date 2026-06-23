import "server-only";
import { Redis } from "@upstash/redis";

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export interface ParkingAlarm {
  id: string;
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
