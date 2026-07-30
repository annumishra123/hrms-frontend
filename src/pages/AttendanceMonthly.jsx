import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ChevronLeft, ChevronRight, ChevronDown, ChevronUp } from "lucide-react";
import { fetchMonthlyAttendance } from "../features/attendance/attendanceSlice";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function AttendanceMonthly() {
  const dispatch = useDispatch();
  const { monthlyLog, monthStatus } = useSelector((s) => s.attendance);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [collapsedDates, setCollapsedDates] = useState({});

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

  const toggleDate = (date) =>
    setCollapsedDates((prev) => ({ ...prev, [date]: !prev[date] }));

  return (
    <div>
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-slate-800">Monthly Log — Date Wise</h3>
          <div className="flex items-center gap-2">
            <button onClick={goPrevMonth} className="p-1.5 rounded-lg hover:bg-slate-100">
              <ChevronLeft size={18} className="text-slate-500" />
            </button>
            <span className="text-sm font-semibold text-slate-700 w-32 text-center">
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
        </div>

        {monthStatus === "loading" ? (
          <Spinner full label="Loading month..." />
        ) : !monthlyLog || monthlyLog.length === 0 ? (
          <p className="text-sm text-slate-400 px-5 py-10 text-center">No records for this month.</p>
        ) : (
          monthlyLog.map(({ date, records }) => {
            const isCollapsed = collapsedDates[date];
            const presentCount = records.filter((r) => r.status === "Present" || r.status === "present").length;
            const absentCount = records.filter((r) => r.status === "Absent" || r.status === "absent").length;
            return (
              <div key={date} className="border-b border-slate-100 last:border-b-0">
                <button
                  onClick={() => toggleDate(date)}
                  className="w-full px-5 py-3 bg-slate-50 flex items-center justify-between hover:bg-slate-100/70"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-slate-700">
                      {new Date(date).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "short", year: "numeric" })}
                    </span>
                    <span className="text-xs text-slate-400">
                      {presentCount} present · {absentCount} absent
                    </span>
                  </div>
                  {isCollapsed ? (
                    <ChevronDown size={16} className="text-slate-400" />
                  ) : (
                    <ChevronUp size={16} className="text-slate-400" />
                  )}
                </button>

                {!isCollapsed && (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-white">
                        <tr>
                          <th className="table-th">Employee</th>
                          <th className="table-th">Check-in</th>
                          <th className="table-th">Check-out</th>
                          <th className="table-th">Hours</th>
                          <th className="table-th">Mode</th>
                          <th className="table-th">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {records.map((row) => (
                          <tr key={row.id} className="hover:bg-slate-50/70">
                            <td className="table-td">
                              <div className="flex items-center gap-3">
                                <Avatar src={row.avatar} name={row.name} size={28} />
                                <span className="font-semibold text-slate-700">{row.name}</span>
                              </div>
                            </td>
                            <td className="table-td text-slate-500">{row.checkIn || "-"}</td>
                            <td className="table-td text-slate-500">{row.checkOut || "-"}</td>
                            <td className="table-td text-slate-500">{row.hours || "-"}</td>
                            <td className="table-td text-slate-500">{row.mode || "-"}</td>
                            <td className="table-td"><Badge>{row.status}</Badge></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}