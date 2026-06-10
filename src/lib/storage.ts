const STORAGE_KEY = "myfloor_data";
const SEEN_PATCH_KEY = "myfloor_seen_patch";

export interface Vehicle {
  id: string;
  name: string;
  floor: string | null;
  updatedAt: string;
}

interface StorageData {
  vehicles: Vehicle[];
}

function read(): StorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : { vehicles: [] };
  } catch {
    return { vehicles: [] };
  }
}

function write(data: StorageData): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getVehicles(): Vehicle[] {
  return read().vehicles;
}

export function addVehicle(name: string): Vehicle {
  const data = read();
  const vehicle: Vehicle = {
    id: crypto.randomUUID(),
    name: name.trim(),
    floor: null,
    updatedAt: new Date().toISOString(),
  };
  data.vehicles.push(vehicle);
  write(data);
  return vehicle;
}

export function updateFloor(id: string, floor: string): void {
  const data = read();
  const v = data.vehicles.find((v) => v.id === id);
  if (v) {
    v.floor = floor;
    v.updatedAt = new Date().toISOString();
    write(data);
  }
}

export function renameVehicle(id: string, name: string): void {
  const data = read();
  const v = data.vehicles.find((v) => v.id === id);
  if (v) {
    v.name = name.trim();
    write(data);
  }
}

export function deleteVehicle(id: string): void {
  const data = read();
  data.vehicles = data.vehicles.filter((v) => v.id !== id);
  write(data);
}

export function getSeenPatchId(): string | null {
  return localStorage.getItem(SEEN_PATCH_KEY);
}

export function markPatchSeen(id: string): void {
  localStorage.setItem(SEEN_PATCH_KEY, id);
}
