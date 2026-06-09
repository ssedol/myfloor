export function formatUpdatedAt(isoString: string): string {
  const date = new Date(isoString);
  const now = new Date();

  const timeStr = date.toLocaleTimeString("ko-KR", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const dateOnly = new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate()
  );

  if (dateOnly.getTime() === today.getTime()) {
    return `오늘 ${timeStr}`;
  }

  return (
    date.toLocaleDateString("ko-KR", { month: "long", day: "numeric" }) +
    " " +
    timeStr
  );
}
