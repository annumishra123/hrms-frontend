import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend,
} from "recharts";
import { FileClock } from "lucide-react";
import { fetchReports } from "../features/reports/reportsSlice";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";

export default function Reports() {
  const dispatch = useDispatch();
  const { departmentDistribution, monthlyHiring, attritionTrend, payrollTrend, auditLogs, status } = useSelector((s) => s.reports);

  useEffect(() => {
    dispatch(fetchReports());
  }, [dispatch]);

  if (status === "loading" || !departmentDistribution.length) return <Spinner full label="Crunching the numbers..." />;

  return (
    <div>
      <PageHeader title="Reports & Analytics" subtitle="Cross-module insights on headcount, hiring, attrition and payroll." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 mb-1">Headcount by Department</h3>
          <p className="text-xs text-slate-400 mb-4">Total: {departmentDistribution.reduce((s, d) => s + d.value, 0)} employees</p>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={departmentDistribution} dataKey="value" nameKey="name" outerRadius={90} label={({ name, value }) => `${value}`}>
                {departmentDistribution.map((d, i) => <Cell key={i} fill={d.color} />)}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 mb-1">Monthly Hiring</h3>
          <p className="text-xs text-slate-400 mb-4">New hires per month</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={monthlyHiring} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} />
              <Bar dataKey="hires" fill="#14b8a6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 mb-1">Attrition Rate</h3>
          <p className="text-xs text-slate-400 mb-4">Monthly attrition, % of workforce</p>
          <ResponsiveContainer width="100%" height={230}>
            <LineChart data={attritionTrend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} formatter={(v) => [`${v}%`, "Attrition"]} />
              <Line type="monotone" dataKey="rate" stroke="#f43f5e" strokeWidth={2.5} dot={{ r: 4, fill: "#f43f5e" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="card p-5">
          <h3 className="font-display font-bold text-slate-800 mb-1">Payroll Spend</h3>
          <p className="text-xs text-slate-400 mb-4">₹ Crore disbursed per month</p>
          <ResponsiveContainer width="100%" height={230}>
            <BarChart data={payrollTrend} margin={{ left: -20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} formatter={(v) => [`₹${v} Cr`, "Payroll"]} />
              <Bar dataKey="amount" fill="#255ce6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
          <FileClock size={17} className="text-navy-700" />
          <h3 className="font-display font-bold text-slate-800">Audit Log</h3>
        </div>
        <div className="divide-y divide-slate-100">
          {auditLogs.map((log) => (
            <div key={log.id} className="px-5 py-3.5 flex items-center justify-between gap-4 text-sm">
              <div className="min-w-0">
                <p className="text-slate-700"><span className="font-semibold">{log.user}</span> — {log.action}</p>
                <p className="text-xs text-slate-400 mt-0.5">{log.module} module</p>
              </div>
              <p className="text-xs text-slate-400 whitespace-nowrap">{log.timestamp}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
