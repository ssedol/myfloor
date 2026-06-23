import { signFloor } from "@/lib/tagToken";
import { APARTMENT_CONFIG } from "@/config/apartment";

const BASE_URL = "https://myfloor.website";

const ALL_FLOORS = [
  ...APARTMENT_CONFIG.undergroundFloors,
  ...APARTMENT_CONFIG.aboveFloors,
];

export default function NfcAdminPage() {
  const rows = ALL_FLOORS.map((floor) => {
    const sig = signFloor(floor);
    const url = `${BASE_URL}/nfc?floor=${encodeURIComponent(floor)}&sig=${sig}`;
    return { floor, url };
  });

  return (
    <div className="max-w-lg mx-auto px-5 py-8">
      <h1 className="text-main text-xl font-bold mb-1">NFC 태그 URL</h1>
      <p className="text-sub text-sm mb-6">각 층 NFC 스티커에 아래 URL을 등록하세요.</p>
      <div className="space-y-3">
        {rows.map(({ floor, url }) => (
          <div key={floor} className="bg-surface rounded-2xl px-4 py-3">
            <p className="text-primary font-bold text-lg mb-1">{floor}</p>
            <p className="text-main text-xs break-all font-mono">{url}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
