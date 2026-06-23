import { redis, ALARM_KEY, parseAlarm, type ParkingAlarm } from "@/lib/redis";

const DURATIONS_MS = {
  slow: 13 * 60 * 60 * 1000, // 13시간
  fast: 45 * 60 * 1000,      // 45분
};

export async function POST(req: Request) {
  try {
    const { subscription, vehicleId, vehicleName, floor, type } = await req.json();

    if (!subscription?.endpoint || !vehicleId || !vehicleName || !floor || !type) {
      return Response.json({ error: "invalid params" }, { status: 400 });
    }

    // 같은 vehicleId의 기존 알람 제거 (중복 방지)
    const all = (await redis.zrange(ALARM_KEY, 0, -1)) as unknown[];
    const existing = all.filter((item) => {
      try { return parseAlarm(item).vehicleId === vehicleId; }
      catch { return false; }
    });
    if (existing.length) await redis.zrem(ALARM_KEY, ...existing);

    const alarm: ParkingAlarm = {
      id: crypto.randomUUID(),
      vehicleId,
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

    return Response.json({ ok: true, triggerAt: alarm.triggerAt });
  } catch (e) {
    console.error("subscribe error", e);
    return Response.json({ error: "server error" }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const { vehicleId } = await req.json();
    const all = (await redis.zrange(ALARM_KEY, 0, -1)) as unknown[];
    const toRemove = all.filter((item) => {
      try { return parseAlarm(item).vehicleId === vehicleId; }
      catch { return false; }
    });
    if (toRemove.length) await redis.zrem(ALARM_KEY, ...toRemove);
    return Response.json({ ok: true });
  } catch (e) {
    console.error("unsubscribe error", e);
    return Response.json({ error: "server error" }, { status: 500 });
  }
}
