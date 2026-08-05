import { STATUS_STYLES } from "../expenseConstants";
import { Clock, CheckCircle2, XCircle } from "lucide-react";

const STATUS_ICONS = {
  Pending: Clock,
  Approved: CheckCircle2,
  Rejected: XCircle,
};

export default function StatusBadge({ status }) {
  const Icon = STATUS_ICONS[status] || Clock;
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${
        STATUS_STYLES[status] || STATUS_STYLES.Pending
      }`}
    >
      <Icon size={12} />
      {status}
    </span>
  );
}