import { cn } from "@/lib/utils";
import {
  ORDER_STATUS_TONE,
  BOOKING_STATUS_TONE,
  TONE_CLASSES,
  ORDER_STATUS_LABELS,
  BOOKING_STATUS_LABELS,
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
  const key = status?.toLowerCase();
  const tone: StatusTone = map[key] ?? "gray";
  const labels = kind === "booking" ? BOOKING_STATUS_LABELS : ORDER_STATUS_LABELS;
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize",
        TONE_CLASSES[tone],
      )}
    >
      {labels[key] ?? status}
    </span>
  );
}
