import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  LifeBuoy, Search, MessageSquare, X, Send, Loader2,
  Circle, Clock, CheckCircle2, XCircle,
} from "lucide-react";
import { fetchAllTickets, changeTicketStatus, postTicketComment } from "../features/tickets/ticketsAdminSlice";

const STATUS_CONFIG = {
  open: { label: "Open", color: "text-amber-500", bg: "bg-amber-500/10", icon: Circle },
  "in-progress": { label: "In Progress", color: "text-blue-500", bg: "bg-blue-500/10", icon: Clock },
  resolved: { label: "Resolved", color: "text-emerald-500", bg: "bg-emerald-500/10", icon: CheckCircle2 },
  closed: { label: "Closed", color: "text-navy-400", bg: "bg-navy-400/10", icon: XCircle },
};
const CATEGORIES = ["IT", "HR", "Payroll", "Facilities", "Other"];

function StatusDropdown({ ticket, onChange }) {
  const [open, setOpen] = useState(false);
  const cfg = STATUS_CONFIG[ticket.status] || STATUS_CONFIG.open;
  const Icon = cfg.icon;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold ${cfg.bg} ${cfg.color}`}
      >
        <Icon size={13} /> {cfg.label}
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-2xl border border-navy-100 py-1.5 z-20">
            {Object.entries(STATUS_CONFIG).map(([key, c]) => {
              const CIcon = c.icon;
              return (
                <button
                  key={key}
                  onClick={() => { onChange(key); setOpen(false); }}
                  className="w-full flex items-center gap-2 px-3.5 py-2 text-sm text-navy-700 hover:bg-navy-50 text-left"
                >
                  <CIcon size={14} className={c.color} /> {c.label}
                </button>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

function TicketDetailDrawer({ ticket, onClose, dispatch }) {
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!comment.trim()) return;
    setSending(true);
    await dispatch(postTicketComment({ id: ticket._id, text: comment }));
    setComment("");
    setSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-navy-950/50 backdrop-blur-sm">
      <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-navy-100">
          <div>
            <p className="text-xs text-navy-400">#{ticket._id.slice(-6).toUpperCase()}</p>
            <h3 className="font-display font-bold text-navy-900">{ticket.subject}</h3>
          </div>
          <button onClick={onClose} className="h-8 w-8 rounded-lg hover:bg-navy-50 flex items-center justify-center text-navy-400">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="px-2.5 py-1 rounded-full bg-brand-500/10 text-brand-600 text-xs font-semibold">
              {ticket.category}
            </span>
            <StatusDropdown ticket={ticket} onChange={(status) => dispatch(changeTicketStatus({ id: ticket._id, status }))} />
          </div>

          <div>
            <p className="text-xs font-semibold text-navy-400 uppercase mb-1.5">Raised By</p>
            <p className="text-sm text-navy-700">{ticket.raisedBy?.name || "—"} {ticket.raisedBy?.employeeId ? `(${ticket.raisedBy.employeeId})` : ""}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-navy-400 uppercase mb-1.5">Description</p>
            <p className="text-sm text-navy-700 bg-navy-50/60 rounded-xl p-3">{ticket.description}</p>
          </div>

          <div>
            <p className="text-xs font-semibold text-navy-400 uppercase mb-2 flex items-center gap-1.5">
              <MessageSquare size={13} /> Comments ({ticket.comments?.length || 0})
            </p>
            <div className="space-y-2.5">
              {(ticket.comments || []).map((c, i) => (
                <div key={i} className="bg-navy-50/60 rounded-xl p-3 text-sm">
                  <p className="text-navy-700">{c.text}</p>
                  <p className="text-[11px] text-navy-400 mt-1">{new Date(c.createdAt || Date.now()).toLocaleString()}</p>
                </div>
              ))}
              {(!ticket.comments || ticket.comments.length === 0) && (
                <p className="text-xs text-navy-300">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-navy-100 flex gap-2">
          <input
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            placeholder="Reply to employee…"
            className="flex-1 rounded-lg border border-navy-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <button
            onClick={handleSend}
            disabled={sending}
            className="h-10 w-10 rounded-lg bg-brand-500 hover:bg-brand-600 text-white flex items-center justify-center disabled:opacity-60"
          >
            {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function HelpdeskAdmin() {
  const dispatch = useDispatch();
  const { list, status } = useSelector((s) => s?.ticketsAdmin);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    dispatch(fetchAllTickets({}));
  }, [dispatch]);

  const counts = useMemo(() => {
    const c = { open: 0, "in-progress": 0, resolved: 0, closed: 0 };
    list.forEach((t) => { if (c[t.status] !== undefined) c[t.status]++; });
    return c;
  }, [list]);

  const filtered = list.filter((t) => {
    if (statusFilter !== "all" && t.status !== statusFilter) return false;
    if (categoryFilter !== "all" && t.category !== categoryFilter) return false;
    if (search && !t.subject?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display font-bold text-2xl text-navy-900 flex items-center gap-2">
            <LifeBuoy size={24} className="text-brand-500" /> Helpdesk Tickets
          </h1>
          <p className="text-navy-400 text-sm mt-0.5">{list.length} total tickets raised by employees</p>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(STATUS_CONFIG).map(([key, c]) => {
          const Icon = c.icon;
          return (
            <button
              key={key}
              onClick={() => setStatusFilter(statusFilter === key ? "all" : key)}
              className={`bg-white rounded-2xl border p-4 text-left transition-all ${
                statusFilter === key ? "border-brand-500 ring-2 ring-brand-500/20" : "border-navy-100 hover:border-navy-200"
              }`}
            >
              <div className={`h-9 w-9 rounded-xl flex items-center justify-center ${c.bg} ${c.color} mb-2`}>
                <Icon size={17} />
              </div>
              <p className="text-2xl font-display font-bold text-navy-900">{counts[key]}</p>
              <p className="text-xs text-navy-400 font-medium">{c.label}</p>
            </button>
          );
        })}
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3 bg-white rounded-2xl border border-navy-100 p-3">
        <div className="flex items-center gap-2 bg-navy-50/60 rounded-lg px-3 py-2 flex-1 min-w-[200px]">
          <Search size={15} className="text-navy-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by subject…"
            className="bg-transparent text-sm flex-1 focus:outline-none"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="rounded-lg border border-navy-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        >
          <option value="all">All Categories</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        {statusFilter !== "all" && (
          <button onClick={() => setStatusFilter("all")} className="text-xs text-brand-600 font-semibold hover:underline">
            Clear filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-navy-100 overflow-hidden">
        {status === "loading" && list.length === 0 ? (
          <div className="flex justify-center py-16"><Loader2 className="animate-spin text-brand-500" size={26} /></div>
        ) : filtered.length === 0 ? (
          <p className="text-center text-navy-300 text-sm py-16">No tickets match your filters</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-navy-50/60 text-navy-400 text-xs uppercase">
                <th className="text-left px-5 py-3 font-semibold">Subject</th>
                <th className="text-left px-5 py-3 font-semibold">Raised By</th>
                <th className="text-left px-5 py-3 font-semibold">Category</th>
                <th className="text-left px-5 py-3 font-semibold">Date</th>
                <th className="text-left px-5 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-navy-100">
              {filtered.map((t) => (
                <tr key={t._id} onClick={() => setSelected(t)} className="hover:bg-navy-50/40 cursor-pointer">
                  <td className="px-5 py-3.5 font-semibold text-navy-800">{t.subject}</td>
                  <td className="px-5 py-3.5 text-navy-600">{t.raisedBy?.name || "—"}</td>
                  <td className="px-5 py-3.5 text-navy-500">{t.category}</td>
                  <td className="px-5 py-3.5 text-navy-400">{new Date(t.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-3.5" onClick={(e) => e.stopPropagation()}>
                    <StatusDropdown ticket={t} onChange={(status) => dispatch(changeTicketStatus({ id: t._id, status }))} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selected && <TicketDetailDrawer ticket={selected} onClose={() => setSelected(null)} dispatch={dispatch} />}
    </div>
  );
}