import { Eye, Check, X as XIcon, Receipt, Inbox } from "lucide-react";
import StatusBadge from "./StatusBadge";
import CategoryBadge from "./CategoryBadge";
import { formatCurrency, timeAgo, getInitials } from "../../utils/expenseHelpers";
import { AVATAR_COLORS } from "../expenseConstants";

function avatarColor(name) {
  const idx = (name || "").length % AVATAR_COLORS.length;
  return AVATAR_COLORS[idx];
}

export default function ExpenseTable({ loading, error, filtered, onView, onApprove, onReject }) {
  if (loading) {
    return (
      <div className="p-10 space-y-3">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="h-10 bg-gray-100 rounded-lg animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="p-10 text-center text-red-500 text-sm">{error}</div>;
  }

  if (filtered.length === 0) {
    return (
      <div className="py-16 text-center">
        <div className="h-14 w-14 mx-auto rounded-xl bg-gray-100 flex items-center justify-center mb-4">
          <Inbox size={24} className="text-gray-400" />
        </div>
        <p className="text-gray-900 font-semibold text-base">No requests here</p>
        <p className="text-gray-400 text-sm mt-1">There's nothing in this filter right now.</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 text-gray-400 text-xs uppercase tracking-wide">
            <th className="text-left font-semibold px-4 py-3">Employee</th>
            <th className="text-left font-semibold px-4 py-3">Title</th>
            <th className="text-left font-semibold px-4 py-3">Category</th>
            <th className="text-left font-semibold px-4 py-3">Date</th>
            <th className="text-right font-semibold px-4 py-3">Amount</th>
            <th className="text-left font-semibold px-4 py-3">Status</th>
            <th className="text-right font-semibold px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((e) => (
            <tr key={e._id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors group">
              <td className="px-4 py-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-8 w-8 shrink-0 rounded-full flex items-center justify-center text-[11px] font-semibold ${avatarColor(
                      e.employee?.name
                    )}`}
                  >
                    {getInitials(e.employee?.name)}
                  </div>
                  <div>
                    <p className="text-gray-900 font-medium leading-tight">{e.employee?.name || "—"}</p>
                    <p className="text-gray-400 text-xs">{e.employee?.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-gray-700">{e.title}</td>
              <td className="px-4 py-3">
                <CategoryBadge category={e.category} />
              </td>
              <td className="px-4 py-3 text-gray-500">{timeAgo(e.date)}</td>
              <td className="px-4 py-3 text-right text-gray-900 font-semibold">{formatCurrency(e.amount)}</td>
              <td className="px-4 py-3">
                <StatusBadge status={e.status} />
              </td>
              <td className="px-4 py-3">
                <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => onView(e)}
                    title="View details"
                    className="h-8 w-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 transition-colors"
                  >
                    <Eye size={15} />
                  </button>
                  {e.status === "Pending" && (
                    <>
                      <button
                        onClick={() => onApprove(e)}
                        title="Approve"
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 transition-colors"
                      >
                        <Check size={15} />
                      </button>
                      <button
                        onClick={() => onReject(e)}
                        title="Reject"
                        className="h-8 w-8 flex items-center justify-center rounded-lg bg-red-50 hover:bg-red-100 text-red-600 transition-colors"
                      >
                        <XIcon size={15} />
                      </button>
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}