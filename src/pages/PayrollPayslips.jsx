import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Search, Download, ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { fetchPayslips, downloadPayslip } from "../features/payroll/payrollSlice";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Badge from "../components/ui/Badge";
import Modal from "../components/ui/Modal";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const STATUS_OPTIONS = ["All", "Draft", "Processed", "Paid"];
const PAGE_SIZE_OPTIONS = [25, 50, 100];

const inr = (n) => `₹${(n ?? 0).toLocaleString("en-IN")}`;

export default function PayrollPayslips() {
  const dispatch = useDispatch();
  const { payslips, totalCount, totalPages, currentPage, payslipsStatus, downloadingId } =
    useSelector((s) => s.payroll);

  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState(""); // debounced value
  const [selected, setSelected] = useState(null);

  // Search ko debounce karte hain — 500 employees mein har keystroke pe API call
  // fire karna wasteful hai, isliye typing rukne ke 400ms baad hi search chalega.
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // Jab bhi filters change hon, page 1 pe wapas le jao (warna page 5 pe filter lagane se empty result aa sakta hai)
  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, month, year, limit]);

  useEffect(() => {
    dispatch(
      fetchPayslips({
        page,
        limit,
        search,
        status: statusFilter === "All" ? "" : statusFilter.toLowerCase(),
        month: month + 1,
        year,
      })
    );
  }, [dispatch, page, limit, search, statusFilter, month, year]);

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

  const handleDownload = (p) => {
    dispatch(downloadPayslip({ payslipId: p.id, employeeName: p.name, month: MONTHS[month] }));
  };

  return (
    <div>
      {/* Filters bar */}
      <div className="card p-4 mb-4 flex flex-wrap items-center gap-3">
        {/* Month selector */}
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

        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by employee name or ID..."
            className="pl-8 pr-8 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-200 w-full"
          />
          {searchInput && (
            <button
              onClick={() => setSearchInput("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>

        {/* Status filter */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          {STATUS_OPTIONS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        {/* Page size */}
        <select
          value={limit}
          onChange={(e) => setLimit(Number(e.target.value))}
          className="text-sm rounded-lg border border-slate-200 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-brand-200"
        >
          {PAGE_SIZE_OPTIONS.map((n) => (
            <option key={n} value={n}>{n} / page</option>
          ))}
        </select>
      </div>

      {/* Table card */}
      <div className="card overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-display font-bold text-slate-800">
            Payslips — {MONTHS[month]} {year}
          </h3>
          <span className="text-xs text-slate-400">{totalCount} employees</span>
        </div>

        {payslipsStatus === "loading" ? (
          <Spinner full label="Loading payslips..." />
        ) : payslips.length === 0 ? (
          <p className="text-sm text-slate-400 px-5 py-10 text-center">No payslips found.</p>
        ) : (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="table-th">Employee</th>
                    <th className="table-th">Basic</th>
                    <th className="table-th">HRA</th>
                    <th className="table-th">Deductions</th>
                    <th className="table-th">Net Pay</th>
                    <th className="table-th">Status</th>
                    <th className="table-th text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {payslips.map((p) => (
                    <tr key={p.id} className="hover:bg-slate-50/70">
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
                      <td className="table-td">
                        <div className="flex items-center justify-end gap-3">
                          <button onClick={() => setSelected(p)} className="text-brand-600 font-semibold text-sm hover:underline">
                            View
                          </button>
                          <button
                            onClick={() => handleDownload(p)}
                            disabled={downloadingId === p.id}
                            className="text-slate-500 hover:text-brand-600 disabled:opacity-50"
                            title="Download PDF"
                          >
                            {downloadingId === p.id ? (
                              <Loader2 size={16} className="animate-spin" />
                            ) : (
                              <Download size={16} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile card list */}
            <div className="md:hidden divide-y divide-slate-100">
              {payslips.map((p) => (
                <div key={p.id} className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <Avatar src={p.avatar} name={p.name} size={36} />
                      <div>
                        <p className="font-semibold text-slate-700 text-sm">{p.name}</p>
                        <p className="text-xs text-slate-400">{p.designation}</p>
                      </div>
                    </div>
                    <Badge>{p.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm mb-3">
                    <span className="text-slate-500">Net Pay</span>
                    <span className="font-bold text-slate-800">{inr(p.net)}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setSelected(p)}
                      className="flex-1 text-sm font-semibold text-brand-600 border border-brand-200 rounded-lg py-2"
                    >
                      View Detail
                    </button>
                    <button
                      onClick={() => handleDownload(p)}
                      disabled={downloadingId === p.id}
                      className="flex-1 flex items-center justify-center gap-1.5 text-sm font-semibold text-white bg-brand-600 rounded-lg py-2 disabled:opacity-50"
                    >
                      {downloadingId === p.id ? (
                        <Loader2 size={14} className="animate-spin" />
                      ) : (
                        <Download size={14} />
                      )}
                      PDF
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
              <p className="text-xs text-slate-400">
                Page {currentPage} of {totalPages} · {totalCount} total
              </p>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
                >
                  Prev
                </button>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 text-sm rounded-lg border border-slate-200 disabled:opacity-30 hover:bg-slate-50"
                >
                  Next
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Payslip detail modal - same as before */}
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
            <button
              onClick={() => handleDownload(selected)}
              disabled={downloadingId === selected.id}
              className="btn-primary w-full mt-5 disabled:opacity-50"
            >
              {downloadingId === selected.id ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Download size={16} />
              )}
              Download PDF
            </button>
          </div>
        )}
      </Modal>
    </div>
  );
}