
import { useEffect, useState } from "react";
import { socket } from "../socket";
import { useDispatch, useSelector } from "react-redux";

import {
  Check,
  X,
  Inbox,
  CalendarDays,
  CalendarCheck,
  CalendarClock,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

import {
  fetchLeaveRequests,
  decideLeaveRequest,
  setLeaveFilter,
  addLeaveRealtime,
  updateLeaveRealtime,
} from "../features/leave/leaveSlice";

import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import EmptyState from "../components/ui/EmptyState";

const TABS = ["Pending", "Approved", "Rejected", "All"];

const TYPE_LABEL = {
  CL: "Casual",
  SL: "Sick",
  EL: "Earned",
  PL: "Paid",
};

const STATUS_STYLE = {
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  Approved: "bg-teal-50 text-teal-700 ring-1 ring-teal-200",
  Rejected: "bg-red-50 text-red-700 ring-1 ring-red-200",
  Cancelled: "bg-slate-100 text-slate-500 ring-1 ring-slate-200",
};

function fmtDate(d) {
  return new Date(d).toLocaleDateString("en-US", { day: "numeric", month: "short" });
}

export default function Leave() {
  const dispatch = useDispatch();
  const { requests, status, filter, error } = useSelector((state) => state.leave);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    dispatch(fetchLeaveRequests());
  }, [dispatch]);

  useEffect(() => {
    socket.on("leave:new", (leave) => dispatch(addLeaveRealtime(leave)));
    socket.on("leave:decided", (leave) => dispatch(updateLeaveRealtime(leave)));

    return () => {
      socket.off("leave:new");
      socket.off("leave:decided");
    };
  }, [dispatch]);

  const filtered =
    filter === "All" ? requests : requests.filter((item) => item.status === filter);

  const counts = {
    Pending: requests.filter((item) => item.status === "Pending").length,
    Approved: requests.filter((item) => item.status === "Approved").length,
    Rejected: requests.filter((item) => item.status === "Rejected").length,
  };

  const handleAction = (id, action) => {
    dispatch(decideLeaveRequest({ id, action }));
  };

  if (status === "loading" && !requests.length) {
    return <Spinner full label="Loading leave requests..." />;
  }

  return (
    <div>

      {error && (
        <div className="mb-4 rounded-xl bg-red-50 border border-red-200 text-red-600 px-4 py-3 text-sm">
          {error}
        </div>
      )}

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CalendarClock} label="Pending" value={counts.Pending} tone="amber" />
        <StatCard icon={CalendarCheck} label="Approved" value={counts.Approved} tone="teal" />
        <StatCard icon={CalendarDays} label="Rejected" value={counts.Rejected} tone="brand" />
        <StatCard icon={CalendarDays} label="Total Requests" value={requests.length} tone="violet" />
      </div>

      {/* Tabs */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex gap-2 overflow-x-auto scrollbar-none">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => dispatch(setLeaveFilter(tab))}
              className={`px-4 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition ${
                filter === tab
                  ? "bg-navy-800 text-white"
                  : "bg-white text-slate-500 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {tab}
              {tab !== "All" && counts[tab] !== undefined && ` (${counts[tab]})`}
            </button>
          ))}
        </div>

        <p className="text-xs text-slate-400 hidden sm:block">
          {filtered.length} {filtered.length === 1 ? "request" : "requests"}
        </p>
      </div>

      {/* Empty */}
      {filtered.length === 0 ? (
        <div className="card">
          <EmptyState
            icon={Inbox}
            title="No requests here"
            subtitle="There's nothing in this filter right now."
          />
        </div>
      ) : (
        <div className="card !p-0 overflow-hidden">
          {/* ===== Desktop table ===== */}
          <div className="hidden md:block">
            <div className="max-h-[560px] overflow-y-auto">
              <table className="w-full text-sm border-collapse">
                <thead className="sticky top-0 bg-slate-50 z-10">
                  <tr className="text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    <th className="px-3 py-3 font-semibold">Type</th>
                    <th className="px-3 py-3 font-semibold">Duration</th>
                    <th className="px-3 py-3 font-semibold text-center">Days</th>
                    <th className="px-3 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {filtered.map((request) => (
                    <>
                      <tr
                        key={request.id}
                        onClick={() =>
                          setExpandedId(expandedId === request.id ? null : request.id)
                        }
                        className="border-t border-slate-100 hover:bg-slate-50 cursor-pointer transition"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-3 min-w-0">
                            <Avatar src={request.avatar} name={request.name} size={32} />
                            <div className="min-w-0">
                              <p className="font-semibold text-slate-700 truncate">
                                {request.name}
                              </p>
                              <p className="text-xs text-slate-400 truncate">
                                {request.employeeId}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                          {TYPE_LABEL[request.type] || request.type}
                        </td>

                        <td className="px-3 py-3 text-slate-600 whitespace-nowrap">
                          {fmtDate(request.from)} → {fmtDate(request.to)}
                        </td>

                        <td className="px-3 py-3 text-center text-slate-600">
                          {request.days}
                        </td>

                        <td className="px-3 py-3">
                          <span
                            className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${
                              STATUS_STYLE[request.status]
                            }`}
                          >
                            {request.status}
                          </span>
                        </td>

                        <td className="px-5 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {request.status === "Pending" ? (
                              <>
                                <button
                                  disabled={status === "loading"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(request.id, "approve");
                                  }}
                                  className="p-1.5 rounded-lg bg-teal-50 text-teal-700 hover:bg-teal-100 disabled:opacity-50 transition"
                                  title="Approve"
                                >
                                  <Check size={16} />
                                </button>
                                <button
                                  disabled={status === "loading"}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleAction(request.id, "reject");
                                  }}
                                  className="p-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 disabled:opacity-50 transition"
                                  title="Reject"
                                >
                                  <X size={16} />
                                </button>
                              </>
                            ) : (
                              <span className="text-slate-300">
                                {expandedId === request.id ? (
                                  <ChevronUp size={16} />
                                ) : (
                                  <ChevronDown size={16} />
                                )}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>

                      {expandedId === request.id && (
                        <tr className="bg-slate-50/60 border-t border-slate-100">
                          <td colSpan={6} className="px-5 py-3 text-xs text-slate-500">
                            <span className="font-semibold text-slate-600">Reason: </span>
                            "{request.reason}"
                            <span className="mx-2 text-slate-300">·</span>
                            Applied {fmtDate(request.appliedOn)}
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* ===== Mobile compact list ===== */}
          <div className="md:hidden divide-y divide-slate-100 max-h-[560px] overflow-y-auto">
            {filtered.map((request) => (
              <div key={request.id} className="p-4">
                <div className="flex items-center gap-3">
                  <Avatar src={request.avatar} name={request.name} size={38} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-semibold text-slate-700 text-sm">{request.name}</p>
                      <span
                        className={`inline-flex px-2 py-0.5 rounded-full text-[11px] font-semibold ${
                          STATUS_STYLE[request.status]
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {TYPE_LABEL[request.type] || request.type} · {fmtDate(request.from)} → {fmtDate(request.to)} · {request.days}d
                    </p>
                  </div>
                </div>

                <p className="text-xs text-slate-400 mt-2 pl-[50px]">
                  "{request.reason}" · Applied {fmtDate(request.appliedOn)}
                </p>

                {request.status === "Pending" && (
                  <div className="flex gap-2 mt-3 pl-[50px]">
                    <button
                      disabled={status === "loading"}
                      onClick={() => handleAction(request.id, "approve")}
                      className="btn-primary !bg-teal-600 hover:!bg-teal-700 !px-3 !py-1.5 !text-xs disabled:opacity-50"
                    >
                      <Check size={14} /> Approve
                    </button>
                    <button
                      disabled={status === "loading"}
                      onClick={() => handleAction(request.id, "reject")}
                      className="btn-danger !px-3 !py-1.5 !text-xs disabled:opacity-50"
                    >
                      <X size={14} /> Reject
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}