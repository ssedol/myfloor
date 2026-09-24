import "server-only";
import webpush from "web-push";
import type { ParkingAlarm } from "./redis";

/**
 * VAPID 설정은 첫 발송 때 한 번만 적용한다.
 *
 * 모듈을 불러오는 시점에 setVapidDetails 를 부르면 빌드의 page data 수집
 * 단계에서도 실행되어, 환경변수가 없는 빌드(미리보기 배포 등)가 통째로
 * 실패한다. 실제로 필요한 시점까지 미뤄두면 빌드는 통과하고, 키가 없을 때는
 * 발송 시점에 원인이 분명한 오류가 난다.
 */
let vapidReady = false;

function ensureVapid() {
  if (vapidReady) return;

  const subject = process.env.VAPID_SUBJECT;
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!subject || !publicKey || !privateKey) {
    throw new Error(
      "푸시 발송에 필요한 환경변수가 없습니다: VAPID_SUBJECT, NEXT_PUBLIC_VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY"
    );
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  vapidReady = true;
}

export async function sendPush(alarm: ParkingAlarm): Promise<boolean> {
  ensureVapid();

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
    if (err && typeof err === "object" && "statusCode" in err) {
      const statusCode = (err as { statusCode: number }).statusCode;
      // 구독 만료/없음(410/404)은 영구 실패 — 조용히 false 반환
      if (statusCode === 410 || statusCode === 404) return false;
    }
    // 그 외(네트워크 오류, 5xx 등)는 일시적 실패 — 다음 크론에서 재시도할 수 있도록 throw
    throw err;
  }
}
