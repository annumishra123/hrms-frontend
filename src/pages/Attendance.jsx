import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { CalendarCheck2, UserX, Clock3, CalendarDays } from "lucide-react";
import { fetchAttendance } from "../features/attendance/attendanceSlice";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";

export default function Attendance() {
  const dispatch = useDispatch();
  const { today, trend, log, status } = useSelector((s) => s.attendance);

  useEffect(() => {
    dispatch(fetchAttendance());
  }, [dispatch]);

  if (status === "loading" || !today) return <Spinner full label="Loading attendance..." />;

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={CalendarCheck2} label="Present" value={today.present} sub={`${today.percentPresent}% of workforce`} tone="teal" />
        <StatCard icon={UserX} label="Absent" value={today.absent} tone="rose" />
        <StatCard icon={Clock3} label="Half Day" value={today.halfDay} tone="amber" />
        <StatCard icon={CalendarDays} label="On Leave" value={today.onLeave} tone="brand" />
      </div>

      <div className="card p-5 mb-6">
        <h3 className="font-display font-bold text-slate-800 mb-1">Weekly Attendance</h3>
        <p className="text-xs text-slate-400 mb-4">Present vs absent, last 7 working days</p>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={trend} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} />
            <Bar dataKey="present" fill="#255ce6" radius={[6, 6, 0, 0]} name="Present" />
            <Bar dataKey="absent" fill="#fda4af" radius={[6, 6, 0, 0]} name="Absent" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="font-display font-bold text-slate-800">Today's Log</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
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
              {log.map((row) => (
                <tr key={row.id} className="hover:bg-slate-50/70">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <Avatar src={row.avatar} name={row.name} size={32} />
                      <span className="font-semibold text-slate-700">{row.name}</span>
                    </div>
                  </td>
                  <td className="table-td text-slate-500">{row.checkIn}</td>
                  <td className="table-td text-slate-500">{row.checkOut}</td>
                  <td className="table-td text-slate-500">{row.hours}</td>
                  <td className="table-td text-slate-500">{row.mode}</td>
                  <td className="table-td"><Badge>{row.status}</Badge></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}