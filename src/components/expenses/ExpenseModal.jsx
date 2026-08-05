import { X as XIcon } from "lucide-react";
import StatusBadge from "./StatusBadge";
import { formatCurrency, formatDate } from "../../utils/expenseHelpers";

export default function ExpenseModal({
  expense,
  reviewAction,
  reviewNote,
  setReviewNote,
  submitting,
  onApprove,
  onReject,
  onSubmitReview,
  onClose,
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white border border-gray-200 rounded-2xl w-full max-w-md shadow-2xl">
        <div className="flex items-start justify-between p-6 pb-4">
          <div>
            <h3 className="text-gray-900 font-semibold text-lg">{expense.title}</h3>
            <p className="text-gray-400 text-xs mt-0.5">
              {expense.employee?.name} · {formatDate(expense.date)}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={expense.status} />
            <button
              onClick={onClose}
              className="h-7 w-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500"
            >
              <XIcon size={14} />
            </button>
          </div>
        </div>

        <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto">
          {expense.imageUrl && (
            <img
              src={`${(import.meta.env.VITE_API_BASE_URL || "").replace("/api/v1", "")}${expense.imageUrl}`}
              alt="Receipt"
              className="w-full rounded-lg border border-gray-200 max-h-64 object-contain bg-gray-50"
            />
          )}

          <div className="grid grid-cols-2 gap-3 text-sm bg-gray-50 rounded-lg p-3">
            <div>
              <p className="text-gray-400 text-xs">Category</p>
              <p className="text-gray-900">{expense.category}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Amount</p>
              <p className="text-gray-900 font-semibold">{formatCurrency(expense.amount)}</p>
            </div>
          </div>

          {expense.notes && (
            <div>
              <p className="text-gray-400 text-xs mb-1">Notes</p>
              <p className="text-gray-700 text-sm">{expense.notes}</p>
            </div>
          )}
        </div>

        <div className="p-6 pt-4">
          {expense.status === "Pending" && !reviewAction && (
            <div className="flex gap-2">
              <button
                onClick={onApprove}
                className="flex-1 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium transition-colors"
              >
                Approve
              </button>
              <button
                onClick={onReject}
                className="flex-1 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
              >
                Reject
              </button>
            </div>
          )}

          {reviewAction && (
            <div className="space-y-3 pt-2 border-t border-gray-100">
              <p className="text-sm text-gray-600">
                {reviewAction === "Approved" ? "Approving" : "Rejecting"} this expense. Add an optional note:
              </p>
              <textarea
                value={reviewNote}
                onChange={(e) => setReviewNote(e.target.value)}
                rows={2}
                placeholder="Reason / note (optional)"
                className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              />
              <div className="flex gap-2">
                <button
                  onClick={onClose}
                  className="flex-1 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm"
                >
                  Cancel
                </button>
                <button
                  onClick={onSubmitReview}
                  disabled={submitting}
                  className={`flex-1 py-2 rounded-lg text-white text-sm font-medium transition-colors ${
                    reviewAction === "Approved"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  } ${submitting ? "opacity-60" : ""}`}
                >
                  {submitting ? "Submitting..." : `Confirm ${reviewAction}`}
                </button>
              </div>
            </div>
          )}

          {!reviewAction && expense.status !== "Pending" && (
            <button
              onClick={onClose}
              className="w-full py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-600 text-sm"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}