import { useEffect } from "react";
import { Receipt, X } from "lucide-react";

export default function NewExpenseToast({ expense, onClose, onView }) {
  useEffect(() => {
    const t = setTimeout(onClose, 5000); // 5 sec baad auto-hide
    return () => clearTimeout(t);
  }, [expense, onClose]);

  if (!expense) return null;

  return (
    <div className="fixed top-5 right-5 z-[60] w-80 bg-white border border-gray-200 rounded-xl shadow-xl p-4 flex items-start gap-3 animate-in slide-in-from-top-4 fade-in duration-200">
      <div className="h-9 w-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
        <Receipt size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">New expense submitted</p>
        <p className="text-xs text-gray-500 mt-0.5 truncate">
          {expense.employee?.name || "An employee"} · {expense.title}
        </p>
        <button
          onClick={() => {
            onView(expense);
            onClose();
          }}
          className="text-xs text-indigo-600 font-medium mt-2 hover:underline"
        >
          View request
        </button>
      </div>
      <button onClick={onClose} className="text-gray-400 hover:text-gray-700 shrink-0">
        <X size={14} />
      </button>
    </div>
  );
}