import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid } from "recharts";
import { Wallet, Users, Clock3, TrendingUp, Download } from "lucide-react";
// import { fetchPayroll } from "../features/payroll/payrollSlice";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

const inr = (n) => `₹${n.toLocaleString("en-IN")}`;

export default function Payroll() {
  const dispatch = useDispatch();
  const { summary, trend, payslips, status } = useSelector((s) => s.payroll);
  const [selected, setSelected] = useState(null);

  // useEffect(() => {
  //   dispatch(fetchPayroll());
  // }, [dispatch]);

  if (status === "loading" || !summary) return <Spinner full label="Loading payroll..." />;

  return (
    <div>
      <PageHeader title="Payroll" subtitle={`Payroll run for ${summary.month}`} />

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard icon={Wallet} label="Total Payroll" value={summary.totalPayroll} tone="violet" />
        <StatCard icon={Users} label="Employees Paid" value={summary.employeesPaid} tone="teal" />
        <StatCard icon={Clock3} label="Pending" value={summary.pending} tone="amber" />
        <StatCard icon={TrendingUp} label="Avg. Net Salary" value={summary.avgSalary} tone="brand" />
      </div>

      <div className="card p-5 mb-6">
        <h3 className="font-display font-bold text-slate-800 mb-1">Payroll Trend</h3>
        <p className="text-xs text-slate-400 mb-4">Total disbursed, last 6 months (₹ in Cr)</p>
        <ResponsiveContainer width="100%" height={240}>
          <LineChart data={trend} margin={{ left: -20 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#eef2f7" vertical={false} />
            <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 12, fill: "#94a3b8" }} axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eef2f7", fontSize: 13 }} formatter={(v) => [`₹${v} Cr`, "Payroll"]} />
            <Line type="monotone" dataKey="amount" stroke="#7c3aed" strokeWidth={2.5} dot={{ r: 4, fill: "#7c3aed" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-slate-800">Payslips — {summary.month}</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="table-th">Employee</th>
                <th className="table-th">Basic</th>
                <th className="table-th">HRA</th>
                <th className="table-th">Deductions</th>
                <th className="table-th">Net Pay</th>
                <th className="table-th">Status</th>
                <th className="table-th text-right">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {payslips.map((p) => (
                <tr key={p.empId} className="hover:bg-slate-50/70">
                  <td className="table-td">
                    <div className="flex items-center gap-3">
                      <Avatar src={p.avatar} name={p.name} size={32} />
                      <div>
                        <p className="font-semibold text-slate-700">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.designation}</p>
                      </div>
                    </div>
                  </td>
                  <td className="table-td text-slate-500">{inr(p.basic)}</td>
                  <td className="table-td text-slate-500">{inr(p.hra)}</td>
                  <td className="table-td text-slate-500">{inr(p.pf + p.tax)}</td>
                  <td className="table-td font-semibold text-slate-700">{inr(p.net)}</td>
                  <td className="table-td"><Badge>{p.status}</Badge></td>
                  <td className="table-td text-right">
                    <button onClick={() => setSelected(p)} className="text-brand-600 font-semibold hover:underline">
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Modal open={!!selected} onClose={() => setSelected(null)} title="Payslip Detail">
        {selected && (
          <div>
            <div className="flex items-center gap-3 mb-5">
              <Avatar src={selected.avatar} name={selected.name} size={48} />
              <div>
                <p className="font-semibold text-slate-800">{selected.name}</p>
                <p className="text-xs text-slate-400">{selected.designation} · {selected.empId}</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Earnings</p>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between"><span>Basic Salary</span><span>{inr(selected.basic)}</span></div>
                  <div className="flex justify-between"><span>HRA</span><span>{inr(selected.hra)}</span></div>
                  <div className="flex justify-between"><span>Special Allowance</span><span>{inr(selected.special)}</span></div>
                  <div className="flex justify-between"><span>Other Allowance</span><span>{inr(selected.other)}</span></div>
                </div>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-400 uppercase mb-2">Deductions</p>
                <div className="space-y-1.5 text-slate-600">
                  <div className="flex justify-between"><span>PF</span><span>{inr(selected.pf)}</span></div>
                  <div className="flex justify-between"><span>Professional Tax</span><span>{inr(selected.tax)}</span></div>
                </div>
              </div>
            </div>
            <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
              <p className="font-display font-bold text-slate-800">Net Pay</p>
              <p className="font-display font-bold text-xl text-navy-800">{inr(selected.net)}</p>
            </div>
            <button className="btn-primary w-full mt-5">
              <Download size={16} /> Download PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}
