import { redis, ALARM_KEY, parseAlarm } from "@/lib/redis";
import { sendPush } from "@/lib/webpush";

export const runtime = "nodejs";

// 임시 테스트용: triggerAt 무시하고 저장된 모든 알람에 즉시 푸시 발송.
// 알람은 삭제하지 않으므로 실제 예약 알림은 그대로 유지됨.
export async function GET() {
  const all = (await redis.zrange(ALARM_KEY, 0, -1)) as unknown[];

  if (!all.length) {
    return Response.json({ sent: 0, note: "저장된 알람이 없어요" });
  }

  let sent = 0;
  const errors: string[] = [];

  for (const item of all) {
    try {
      const alarm = parseAlarm(item);
      const ok = await sendPush(alarm);
      if (ok) sent++;
      else errors.push("구독 만료/없음 (410/404)");
    } catch (e) {
      errors.push(String(e));
    }
  }

  return Response.json({ sent, total: all.length, errors });
}
