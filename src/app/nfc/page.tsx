import NfcClient from "./NfcClient";
import { verifyFloor } from "@/lib/tagToken";

export default async function NfcPage({
  searchParams,
}: {
  searchParams: Promise<{ floor?: string; sig?: string }>;
}) {
  const { floor, sig } = await searchParams;
  // 서명 검증: 정품 태그(올바른 sig)만 통과. 위조/무단 생성 차단.
  const valid = !!floor && verifyFloor(floor, sig);
  return <NfcClient floor={valid ? floor! : null} />;
}
