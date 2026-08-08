import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, Loader2, CheckCircle2, XCircle, RotateCcw, FileArchive, AlertTriangle } from "lucide-react";
import {
  startPayrollRun,
  pollPayrollRunStatus,
  downloadAllPayslips,
  retryFailedRun,
  resetPayrollRun,
  fetchPayrollOverview,
} from "../features/payroll/payrollSlice";

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

export default function PayrollRunPanel({ month, year }) {
  const dispatch = useDispatch();
  const { run } = useSelector((s) => s.payroll);
  const pollRef = useRef(null);

  const isRunning = run.status === "queued" || run.status === "processing";
  const percent = run.total > 0 ? Math.round((run.processed / run.total) * 100) : 0;

  useEffect(() => {
    dispatch(resetPayrollRun());
    return () => clearInterval(pollRef.current);
  }, [dispatch, month, year]);

  useEffect(() => {
    if (isRunning && run.runId) {
      pollRef.current = setInterval(() => {
        dispatch(pollPayrollRunStatus(run.runId)).then((res) => {
          const s = res.payload?.status;
          if (s === "completed" || s === "failed") {
            clearInterval(pollRef.current);
            dispatch(fetchPayrollOverview({ month: month + 1, year }));
          }
        });
      }, 2000);
    }
    return () => clearInterval(pollRef.current);
  }, [isRunning, run.runId, dispatch, month, year]);

  const handleRun = () => {
    const confirmed = window.confirm(
      `${MONTHS[month]} ${year}} Payroll process will be initiated for the employees. Please confirm.`
    );
    if (confirmed) {
      dispatch(startPayrollRun({ month: month + 1, year }));
    }
  };

  const handleDownloadAll = () => {
    dispatch(downloadAllPayslips({ runId: run.runId, month: MONTHS[month], year }));
  };

  const handleRetry = () => {
    dispatch(retryFailedRun(run.runId));
  };

  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h3 className="font-display font-bold text-slate-800">Run Payroll</h3>
          <p className="text-xs text-slate-400">
            {MONTHS[month]} {year} Generate payroll for all employees with a single click.
          </p>
        </div>

        {run.status === "idle" && (
          <button onClick={handleRun} className="btn-primary">
            <Play size={16} /> Run Payroll
          </button>
        )}

        {isRunning && (
          <div className="flex items-center gap-2 text-brand-600 font-semibold text-sm">
            <Loader2 size={16} className="animate-spin" />
            Processing {run.processed}/{run.total}
          </div>
        )}

        {run.status === "completed" && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-emerald-600 text-sm font-semibold">
              <CheckCircle2 size={16} /> Completed
            </span>
            {/* <button
              onClick={handleDownloadAll}
              disabled={run.downloadingZip}
              className="btn-primary disabled:opacity-50"
            >
              {run.downloadingZip ? <Loader2 size={16} className="animate-spin" /> : <FileArchive size={16} />}
              Download All (ZIP)
            </button> */}
          </div>
        )}

        {run.status === "failed" && (
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 text-rose-600 text-sm font-semibold">
              <XCircle size={16} /> Run Failed
            </span>
            <button onClick={handleRun} className="btn-primary">
              <RotateCcw size={16} /> Retry
            </button>
          </div>
        )}
      </div>

      {/* Progress bar */}
      {(isRunning || run.status === "completed") && run.total > 0 && (
        <div className="mt-4">
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-brand-600 transition-all duration-500"
              style={{ width: `${percent}%` }}
            />
          </div>
          <p className="text-xs text-slate-400 mt-1">{percent}% complete</p>
        </div>
      )}

      {/* Errors list — kuch employees ke liye payslip fail hui to yahan dikhega */}
      {run.errors?.length > 0 && (
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <p className="flex items-center gap-1.5 text-sm font-semibold text-amber-700">
              <AlertTriangle size={15} /> {run.errors.length} employees fail hue
            </p>
            <button
              onClick={handleRetry}
              disabled={run.retrying}
              className="text-xs font-semibold text-amber-700 hover:underline disabled:opacity-50"
            >
              {run.retrying ? "Retrying..." : "Retry Failed Only"}
            </button>
          </div>
          <ul className="text-xs text-amber-700 space-y-1 max-h-32 overflow-y-auto">
            {run.errors.map((e) => (
              <li key={e.empId}>
                {e.name} ({e.empId}) — {e.reason}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}