export interface StoredAlarm {
  vehicleId: string;
  vehicleName: string;
  floor: string;
  type: "slow" | "fast";
  triggerAt: number; // Unix ms
}

const KEY = "myfloor_alarms";

function load(): Record<string, StoredAlarm> {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "{}");
  } catch {
    return {};
  }
}

function save(data: Record<string, StoredAlarm>) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function getAllAlarms(): Record<string, StoredAlarm> {
  return load();
}

export function setAlarm(alarm: StoredAlarm) {
  const data = load();
  data[alarm.vehicleId] = alarm;
  save(data);
}

export function clearAlarm(vehicleId: string) {
  const data = load();
  delete data[vehicleId];
  save(data);
}

export function clearExpiredAlarms() {
  const now = Date.now();
  const data = load();
  let changed = false;
  for (const id of Object.keys(data)) {
    if (data[id].triggerAt <= now) {
      delete data[id];
      changed = true;
    }
  }
  if (changed) save(data);
}
