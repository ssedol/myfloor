import { redis, ALARM_KEY, type ParkingAlarm } from "@/lib/redis";

const DURATIONS_MS = {
  slow: 13 * 60 * 60 * 1000, // 13시간
  fast: 45 * 60 * 1000,      // 45분
};

export async function POST(req: Request) {
  try {
    const { subscription, vehicleName, floor, type } = await req.json();

    if (!subscription?.endpoint || !vehicleName || !floor || !type) {
      return Response.json({ error: "invalid params" }, { status: 400 });
    }

    const alarm: ParkingAlarm = {
      id: crypto.randomUUID(),
      subscription,
      vehicleName,
      floor,
      type,
      triggerAt: Date.now() + DURATIONS_MS[type as "slow" | "fast"],
    };

    await redis.zadd(ALARM_KEY, {
      score: alarm.triggerAt,
      member: JSON.stringify(alarm),
    });

    return Response.json({ ok: true });
  } catch (e) {
    console.error("subscribe error", e);
    return Response.json({ error: "server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { endpoint } = await req.json();
    // endpoint가 포함된 alarm 항목을 전부 제거
    const all = await redis.zrange(ALARM_KEY, 0, -1);
    const toRemove = all.filter((item) => {
      try {
        return JSON.parse(item as string).subscription.endpoint === endpoint;
      } catch {
        return false;
      }
    });
    if (toRemove.length) await redis.zrem(ALARM_KEY, ...toRemove);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("unsubscribe error", e);
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
