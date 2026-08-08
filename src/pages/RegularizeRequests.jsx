import { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Eye, CheckCircle2, XCircle, Clock, RefreshCcw } from "lucide-react";
import {
  fetchAllRegularizeRequests,
  addRegularizeRealtime,
  updateRegularizeRealtime,
} from "../features/regularize/regularizeSlice";
import {
  listenRegularizeNew,
  removeRegularizeNewListener,
  listenRegularizeUpdated,
  removeRegularizeUpdatedListener,
} from "../services/socket";
import RegularizeDetailModal from "../components/regularize/RegularizeDetailModal";

const STATUS_TABS = ["Pending", "Approved", "Rejected", "All"];

const STATUS_META = {
  Pending: { cls: "bg-amber-50 text-amber-700 border-amber-200", icon: Clock },
  Approved: { cls: "bg-emerald-50 text-emerald-700 border-emerald-200", icon: CheckCircle2 },
  Rejected: { cls: "bg-rose-50 text-rose-700 border-rose-200", icon: XCircle },
};

function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d)) return dateStr;
  return d.toLocaleDateString("en-US", { day: "numeric", month: "short", year: "numeric" });
}

export default function RegularizeRequests() {
  const dispatch = useDispatch();
  const { list, status, error } = useSelector((s) => s.regularize);

  const [activeStatus, setActiveStatus] = useState("Pending");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState(null);

  // ---- ek hi baar sara data fetch (Leave.jsx jaisa) ----
  useEffect(() => {
    dispatch(fetchAllRegularizeRequests()); // status param nahi bhejte — sab kuch le aao
  }, [dispatch]);

  // ---- realtime socket listeners ----
  useEffect(() => {
    const onNew = (payload) => dispatch(addRegularizeRealtime(payload));
    const onUpdated = (payload) => dispatch(updateRegularizeRealtime(payload));

    listenRegularizeNew(onNew);
    listenRegularizeUpdated(onUpdated);

    return () => {
      removeRegularizeNewListener(onNew);
      removeRegularizeUpdatedListener(onUpdated);
    };
  }, [dispatch]);

  // ---- client-side status + search filter (Leave.jsx jaisa hi) ----
  const filtered = useMemo(() => {
    let result =
      activeStatus === "All"
        ? list
        : list.filter((r) => r.status?.toLowerCase() === activeStatus.toLowerCase());

    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.employeeName?.toLowerCase().includes(q) ||
          r.employeeCode?.toLowerCase().includes(q) ||
          r.date?.includes(q)
      );
    }

    return result;
  }, [list, search, activeStatus]);

  const counts = {
    Pending: list.filter((r) => r.status?.toLowerCase() === "pending").length,
    Approved: list.filter((r) => r.status?.toLowerCase() === "approved").length,
    Rejected: list.filter((r) => r.status?.toLowerCase() === "rejected").length,
  };

  const loading = status === "loading";

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="font-display text-xl font-bold text-navy-900">Regularize Requests</h1>
          <p className="text-sm text-navy-400 mt-0.5">
            Review and act on employee attendance correction requests.
          </p>
        </div>
        <button
          onClick={() => dispatch(fetchAllRegularizeRequests())}
          className="flex items-center gap-2 px-3.5 py-2 rounded-lg border border-navy-200 text-navy-600 text-sm font-medium hover:bg-navy-50 transition-colors"
        >
          <RefreshCcw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-1 bg-navy-50 p-1 rounded-lg">
          {STATUS_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveStatus(tab)}
              className={`px-3.5 py-1.5 rounded-md text-sm font-medium transition-colors ${
                activeStatus === tab
                  ? "bg-white text-navy-900 shadow-sm"
                  : "text-navy-500 hover:text-navy-800"
              }`}
            >
              {tab}
              {tab !== "All" && counts[tab] !== undefined && ` (${counts[tab]})`}
            </button>
          ))}
        </div>

        <div className="relative">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-navy-300" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search employee or date..."
            className="pl-9 pr-3 py-2 rounded-lg border border-navy-200 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-brand-500/30 focus:border-brand-400"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-navy-100 overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-navy-50 text-navy-500 text-xs uppercase tracking-wide">
              <th className="text-left px-4 py-3 font-semibold">Employee</th>
              <th className="text-left px-4 py-3 font-semibold">Date</th>
              <th className="text-left px-4 py-3 font-semibold">Reason</th>
              <th className="text-left px-4 py-3 font-semibold">Requested Time</th>
              <th className="text-left px-4 py-3 font-semibold">Status</th>
              <th className="text-right px-4 py-3 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading && !list.length ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy-400">
                  Loading requests...
                </td>
              </tr>
            ) : error ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-rose-500">
                  {error}
                </td>
              </tr>
            ) : filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-10 text-center text-navy-400">
                  No requests found.
                </td>
              </tr>
            ) : (
              filtered.map((req) => {
                // Backend status "pending"/"approved"/"rejected" (lowercase) hai — display ke liye capitalize
                const displayStatus =
                  req.status?.charAt(0).toUpperCase() + req.status?.slice(1);
                const meta = STATUS_META[displayStatus] || STATUS_META.Pending;
                const StatusIcon = meta.icon;
                return (
                  <tr
                    key={req.id}
                    className="border-t border-navy-50 hover:bg-navy-50/50 transition-colors cursor-pointer"
                    onClick={() => setSelectedId(req.id)}
                  >
                    <td className="px-4 py-3">
                      <div className="font-medium text-navy-900">{req.employeeName}</div>
                      <div className="text-xs text-navy-400">{req.employeeCode}</div>
                    </td>
                    <td className="px-4 py-3 text-navy-600">{formatDate(req.date)}</td>
                    <td className="px-4 py-3 text-navy-600">{req.reasonLabel}</td>
                    <td className="px-4 py-3 text-navy-600">
                      {[req.requestedCheckInTime, req.requestedCheckOutTime].filter(Boolean).join(" – ") || "—"}
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border ${meta.cls}`}>
                        <StatusIcon size={12} />
                        {displayStatus}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedId(req.id);
                        }}
                        className="inline-flex items-center gap-1 text-brand-600 text-sm font-medium hover:underline"
                      >
                        <Eye size={14} /> View
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {selectedId && (
        <RegularizeDetailModal requestId={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  );
}