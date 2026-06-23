import { redis, ALARM_KEY, type ParkingAlarm } from "@/lib/redis";
import { sendPush } from "@/lib/webpush";

export const runtime = "nodejs";

export async function GET(req: Request) {
  // Vercel Cron 인증
  const auth = req.headers.get("authorization");
  if (auth !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const now = Date.now();

  // triggerAt <= now 인 알람 전부 가져오기 (ZRANGE ... BYSCORE)
  const due = (await redis.zrange(ALARM_KEY, 0, now, { byScore: true })) as string[];

  if (!due.length) {
    return Response.json({ sent: 0 });
  }

  let sent = 0;
  for (const item of due) {
    try {
      const alarm: ParkingAlarm = JSON.parse(item);
      await sendPush(alarm);
      sent++;
    } catch (e) {
      console.error("notify error", e);
    }
  }

  // 발송 완료 항목 삭제 (score 범위로 삭제)
  await redis.zremrangebyscore(ALARM_KEY, 0, now);

  return Response.json({ sent });
}
