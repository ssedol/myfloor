import NfcClient from "./NfcClient";

export default async function NfcPage({
  searchParams,
}: {
  searchParams: Promise<{ floor?: string }>;
}) {
  const { floor } = await searchParams;
  return <NfcClient floor={floor ?? null} />;
}
