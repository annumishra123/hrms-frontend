import { Search, X } from "lucide-react";
import { TABS } from "../expenseConstants";

export default function ExpenseFilters({ search, setSearch, tab, setTab, getTabCount }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-3 justify-between">
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-3 py-2 w-full sm:w-80 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100 transition-all">
        <Search size={16} className="text-gray-400 shrink-0" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title, category, employee..."
          className="bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 w-full"
        />
        {search && (
          <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-700">
            <X size={14} />
          </button>
        )}
      </div>

      <div className="flex items-center gap-2 overflow-x-auto scrollbar-none">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium border whitespace-nowrap transition-all ${
              tab === t
                ? "bg-indigo-900 border-indigo-900 text-white shadow-sm"
                : "bg-white border-gray-200 text-gray-600 hover:text-gray-900 hover:border-gray-300"
            }`}
          >
            {t}
            <span
              className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                tab === t ? "bg-white/20" : "bg-gray-100"
              }`}
            >
              {getTabCount(t)}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}