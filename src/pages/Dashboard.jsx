import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Users,
  CalendarCheck2,
  Wallet,
  Briefcase,
  UserPlus,
  Building2,
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { fetchDashboard } from "../features/dashboard/dashboardSlice";
import StatCard from "../components/ui/StatCard";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import { employees, leaveRequests } from "../data/mockData";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { data, status } = useSelector((s) => s.dashboard);
  const user = useSelector((s) => s.auth.user);

  useEffect(() => {
    dispatch(fetchDashboard());
  }, [dispatch]);

  if (status === "loading" || !data) return <Spinner full label="Loading dashboard..." />;

  const pending = leaveRequests.filter((r) => r.status === "Pending");

  return (
    <div>
      <PageHeader
        title={`Good morning, ${user?.name?.split(" ")[0] || "Admin"} 👋`}
        subtitle="Here's what's happening across TechSoft Solutions today."
      />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Users} label="Total Employees" value={data.totalEmployees} sub="Across 6 departments" tone="brand" />
        <StatCard icon={CalendarCheck2} label="Present Today" value={`${data.attendanceToday.present}`} sub={`${data.attendanceToday.percentPresent}% attendance`} tone="teal" />
        <StatCard icon={Wallet} label="Monthly Payroll" value={data.payrollSummary.totalPayroll} sub={data.payrollSummary.month} tone="violet" />
        <StatCard icon={Briefcase} label="Open Positions" value={data.openPositions} sub={`${data.newHires} hired this month`} tone="amber" />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
        <div className="xl:col-span-2 card p-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-display font-bold text-slate-800">Attendance Trend</h3>
              <p className="text-xs text-slate-400 mt-0.5">Last 7 working days</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={data.attendanceTrend} margin={{ left: -20, top: 5 }}>
              <defs>
                <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#255ce6" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#255ce6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} />
              <Area type="monotone" dataKey="present" stroke="#255ce6" strokeWidth={2.5} fill="url(#presentGrad)" name="Present" />
              <Area type="monotone" dataKey="absent" stroke="#f43f5e" strokeWidth={2} fill="transparent" name="Absent" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 mb-1">Department Split</h3>
          <p className="text-xs text-slate-400 mb-2">Headcount by department</p>
          <ResponsiveContainer width="100%" height={230}>
            <PieChart>
              <Pie
                data={data.departmentDistribution}
                dataKey="value"
                nameKey="name"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={3}
              >
                {data.departmentDistribution.map((d, i) => (
                  <Cell key={i} fill={d.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-1">
            {data.departmentDistribution.map((d) => (
              <div key={d.name} className="flex items-center gap-1.5 text-xs text-slate-500">
                <span className="h-2 w-2 rounded-full shrink-0" style={{ background: d.color }} />
                <span className="truncate">{d.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-slate-800">Pending Leave Approvals</h3>
            <span className="badge bg-amber-50 text-amber-700">{pending.length} pending</span>
          </div>
          <div className="space-y-3">
            {pending.slice(0, 4).map((r) => (
              <div key={r.id} className="flex items-center gap-3">
                <Avatar src={r.avatar} name={r.name} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-700 truncate">{r.name}</p>
                  <p className="text-xs text-slate-400 truncate">
                    {r.type} · {r.days} day{r.days > 1 ? "s" : ""}
                  </p>
                </div>
                <Badge>{r.status}</Badge>
              </div>
            ))}
          </div>
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-display font-bold text-slate-800">Recent Employees</h3>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <Building2 size={13} /> TechSoft Solutions
            </span>
          </div>
          <div className="space-y-3">
            {employees.slice(0, 4).map((e) => (
              <div key={e.id} className="flex items-center gap-3">
                <Avatar src={e.avatar} name={e.name} size={38} />
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-semibold text-slate-700 truncate">{e.name}</p>
                  <p className="text-xs text-slate-400 truncate">{e.designation}</p>
                </div>
                <Badge>{e.status}</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
