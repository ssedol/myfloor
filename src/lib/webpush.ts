import "server-only";
import webpush from "web-push";
import type { ParkingAlarm } from "./redis";

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
);

export async function sendPush(alarm: ParkingAlarm): Promise<boolean> {
  const typeLabel = alarm.type === "slow" ? "완속충전" : "급속충전";
  const timeLabel = alarm.type === "slow" ? "13시간" : "45분";

  try {
    await webpush.sendNotification(
      {
        endpoint: alarm.subscription.endpoint,
        keys: alarm.subscription.keys,
      },
      JSON.stringify({
        title: "⏰ 주차 알림",
        body: `${alarm.vehicleName} (${alarm.floor}) ${typeLabel} ${timeLabel} 지났어요`,
        tag: `parking-${alarm.id}`,
      })
    );
    return true;
  } catch (err: unknown) {
    // 구독 만료(410) 등은 조용히 처리
    if (err && typeof err === "object" && "statusCode" in err) {
      const statusCode = (err as { statusCode: number }).statusCode;
      if (statusCode === 410 || statusCode === 404) return false;
    }
    console.error("push send error", err);
    return false;
  }
}
