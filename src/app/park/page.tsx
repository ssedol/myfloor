import ParkClient from "./ParkClient";

export default async function ParkPage({
  searchParams,
}: {
  searchParams: Promise<{ floor?: string }>;
}) {
  const { floor } = await searchParams;
  return <ParkClient floor={floor ?? null} />;
}
