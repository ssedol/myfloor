import { redis, ALARM_KEY, parseAlarm, type ParkingAlarm } from "@/lib/redis";
import { sendPush } from "@/lib/webpush";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.ALARM_CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = Date.now();

  // triggerAt <= now 인 알람 전부 가져오기 (ZRANGE ... BYSCORE)
  const due = (await redis.zrange(ALARM_KEY, 0, now, { byScore: true })) as unknown[];

  if (!due.length) {
    return Response.json({ sent: 0 });
  }

  let sent = 0;
  const toRemove: unknown[] = [];

  for (const item of due) {
    let alarm: ParkingAlarm;
    try {
      alarm = parseAlarm(item);
    } catch {
      toRemove.push(item); // 잘못된 형식은 그냥 삭제
      continue;
    }

    try {
      const ok = await sendPush(alarm);
      // 성공(true) 또는 영구 실패(false, 410/404) 모두 삭제 대상
      toRemove.push(item);
      if (ok) sent++;
    } catch (e) {
      // 일시적 오류 — 삭제하지 않고 다음 크론 실행 시 재시도
      console.error("notify error", e);
    }
  }

  if (toRemove.length) {
    await redis.zrem(ALARM_KEY, ...toRemove);
  }

  return Response.json({ sent });
}
