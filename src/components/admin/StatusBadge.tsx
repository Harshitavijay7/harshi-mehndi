import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_TONE,
  BOOKING_STATUS_TONE,
  TONE_CLASSES,
  type StatusTone,
} from "@/lib/adminUtils";

export function StatusBadge({
  status,
  kind = "order",
}: {
  status: string;
  kind?: "order" | "booking";
}) {
  const map = kind === "booking" ? BOOKING_STATUS_TONE : ORDER_STATUS_TONE;
  const tone: StatusTone = map[status?.toLowerCase()] ?? "gray";
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        TONE_CLASSES[tone],
      )}
    >
      {status}
    </span>
  );
}
