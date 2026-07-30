import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Wallet, Users, Clock3, TrendingUp, ChevronLeft, ChevronRight } from "lucide-react";
import { fetchPayrollOverview } from "../features/payroll/payrollSlice";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const inr = (n) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

export default function PayrollOverview() {
  const dispatch = useDispatch();
  const { summary, trend, overviewStatus } = useSelector((s) => s.payroll);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  useEffect(() => {
    dispatch(fetchPayrollOverview({ month: month + 1, year }));
  }, [dispatch, month, year]);

  const isCurrentMonth = month === now.getMonth() && year === now.getFullYear();

  const goPrevMonth = () => {
    if (month === 0) { setMonth(11); setYear((y) => y - 1); }
    else setMonth((m) => m - 1);
  };
  const goNextMonth = () => {
    if (isCurrentMonth) return;
    if (month === 11) { setMonth(0); setYear((y) => y + 1); }
    else setMonth((m) => m + 1);
  };

  if (overviewStatus === "loading" || !summary) return <Spinner full label="Loading payroll overview..." />;

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <PageHeader title="Payroll Overview" subtitle={`Payroll run for ${MONTHS[month]} ${year}`} />
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

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Wallet} label="Total Payroll" value={inr(summary.totalPayroll)} tone="violet" />
        <StatCard icon={Users} label="Employees Paid" value={`${summary.employeesPaid}/${summary.totalEmployees}`} tone="teal" />
        <StatCard icon={Clock3} label="Pending" value={summary.pending} tone="amber" />
        <StatCard icon={TrendingUp} label="Avg. Net Salary" value={inr(summary.avgSalary)} tone="brand" />
      </div>

      <div className="card p-5">
        <h3 className="font-display font-bold text-slate-800 mb-1">Payroll Trend</h3>
        <p className="text-xs text-slate-400 mb-4">Total disbursed, last 6 months (₹ in Cr)</p>
        <ResponsiveContainer width="100%" height={260}>
          <LineChart data={trend} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} formatter={(v) => [`₹${v} Cr`, "Payroll"]} />
            <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}