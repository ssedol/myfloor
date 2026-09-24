import type { Metadata } from "next";
import { signFloor } from "@/lib/tagToken";
import { APARTMENT_CONFIG } from "@/config/apartment";

export const metadata: Metadata = {
  // 태그 발급용 내부 도구 — 검색 색인 대상이 아니다.
  robots: { index: false, follow: false },
};

/**
 * 요청 시점에 렌더한다.
 *
 * 이 페이지는 NFC_TAG_SECRET 으로 층별 서명을 만든다. 빌드 때 미리 렌더하면
 * 그 비밀키가 없는 빌드(미리보기 배포 등)가 통째로 실패하고, 서명 값이 빌드
 * 산출물에 그대로 박힌다. 접속자가 거의 없는 내부 도구라 요청마다 렌더해도
 * 비용이 없다.
 */
export const dynamic = "force-dynamic";


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
