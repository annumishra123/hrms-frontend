import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, ArrowUpDown, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchMonthlyAttendance } from "../features/attendance/attendanceSlice";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

function formatHours(h) {
  if (h == null) return "-";
  const hrs = Math.floor(h);
  const mins = Math.round((h - hrs) * 60);
  return mins > 0 ? `${hrs}h ${mins}m` : `${hrs}h`;
}

export default function AttendanceSummary() {
  const dispatch = useDispatch();
  const { summary, monthStatus } = useSelector((s) => s.attendance);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [search, setSearch] = useState("");
  const [sortKey, setSortKey] = useState("totalHours");
  const [sortDir, setSortDir] = useState("desc");

  useEffect(() => {
    dispatch(fetchMonthlyAttendance({ month: month + 1, year }));
  }, [dispatch, month, year]);

  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const goPrevMonth = () => {
    if (month === 0) {
      setMonth(11);
      setYear((y) => y - 1);
    } else setMonth((m) => m - 1);
  };

  const goNextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 11) {
      setMonth(0);
      setYear((y) => y + 1);
    } else setMonth((m) => m + 1);
  };

  const toggleSort = (key) => {
    if (sortKey === key) setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    else {
      setSortKey(key);
      setSortDir("desc");
    }
  };

  const filteredSummary = useMemo(() => {
    let rows = summary || [];
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      rows = rows.filter((r) => r.name.toLowerCase().includes(q));
    }
    rows = [...rows].sort((a, b) => {
      let av = a[sortKey], bv = b[sortKey];
      if (typeof av === "string") {
        av = av.toLowerCase();
        bv = bv.toLowerCase();
        return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === "asc" ? av - bv : bv - av;
    });
    return rows;
  }, [summary, search, sortKey, sortDir]);

  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-display font-bold text-slate-800">Monthly Summary Per Employee</h3>
          <p className="text-xs text-slate-400 mt-0.5">Total present days & hours worked</p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <button onClick={goPrevMonth} className="p-1.5 rounded-lg hover:bg-slate-100">
              <ChevronLeft size={18} className="text-slate-500" />
            </button>
            <span className="text-sm font-semibold text-slate-700 w-28 text-center">
              {MONTHS[month]} {year}
            </span>
            <button
              onClick={goNextMonth}
              disabled={isCurrentMonth}
              className="p-1.5 rounded-lg hover:bg-slate-100 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={18} className="text-slate-500" />
            </button>
          </div>

          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search employee..."
              className="pl-8 pr-3 py-1.5 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-200 w-52"
            />
          </div>
        </div>
      </div>

      {monthStatus === "loading" ? (
        <Spinner full label="Loading summary..." />
      ) : filteredSummary.length === 0 ? (
        <p className="text-sm text-slate-400 px-5 py-10 text-center">No employees found.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="table-th cursor-pointer select-none" onClick={() => toggleSort("name")}>
                  <span className="inline-flex items-center gap-1">Employee <ArrowUpDown size={12} /></span>
                </th>
                <th className="table-th cursor-pointer select-none" onClick={() => toggleSort("present")}>
                  <span className="inline-flex items-center gap-1">Present Days <ArrowUpDown size={12} /></span>
                </th>
                <th className="table-th cursor-pointer select-none" onClick={() => toggleSort("absent")}>
                  <span className="inline-flex items-center gap-1">Absent Days <ArrowUpDown size={12} /></span>
                </th>
                <th className="table-th">Half Days</th>
                <th className="table-th">On Leave</th>
                <th className="table-th cursor-pointer select-none" onClick={() => toggleSort("totalHours")}>
                  <span className="inline-flex items-center gap-1">Total Hours <ArrowUpDown size={12} /></span>
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredSummary.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <Avatar src={row.avatar} name={row.name} size={32} />
                      <span className="font-semibold text-slate-700">{row.name}</span>
                    </div>
                  </td>
                  <td className="table-td text-slate-600 font-semibold">{row.present}</td>
                  <td className="table-td text-rose-500 font-semibold">{row.absent}</td>
                  <td className="table-td text-amber-500">{row.halfDay}</td>
                  <td className="table-td text-brand-500">{row.onLeave}</td>
                  <td className="table-td font-bold text-slate-800">{formatHours(row.totalHours)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}