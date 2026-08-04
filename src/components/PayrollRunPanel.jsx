import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Play, Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import {
  startPayrollRun,
  pollPayrollRunStatus,
  fetchPayrollOverview,
  fetchPayslips,
  resetPayrollRun,
} from "../features/payroll/payrollSlice";

export default function PayrollRunPanel({ month, year }) {
  const dispatch = useDispatch();
  const { run } = useSelector((s) => s.payroll);
  const pollTimer = useRef(null);

  const isRunning = run.status === "queued" || run.status === "processing";

  useEffect(() => {
    if (isRunning && run.runId) {
      pollTimer.current = setInterval(() => {
        dispatch(pollPayrollRunStatus(run.runId));
      }, 1500);
    }
    return () => clearInterval(pollTimer.current);
  }, [isRunning, run.runId, dispatch]);

  useEffect(() => {
    if (run.status === "completed") {
      clearInterval(pollTimer.current);
      dispatch(fetchPayrollOverview({ month: month + 1, year }));
      dispatch(fetchPayslips({ page: 1, limit: 25, search: "", status: "", month: month + 1, year }));
    }
  }, [run.status, dispatch, month, year]);

  const handleRun = () => {
    dispatch(resetPayrollRun());
    dispatch(startPayrollRun({ month: month + 1, year }));
  };

  const percent = run.total ? Math.round((run.processed / run.total) * 100) : 0;

  return (
    <div className="card p-5 mb-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h3 className="font-display font-bold text-slate-800">Auto Payroll Run</h3>
          <p className="text-xs text-slate-400">
            Ek click mein saare employees (5000+) ki salary automatically calculate ho jayegi.
          </p>
        </div>

        <button
          onClick={handleRun}
          disabled={isRunning}
          className="flex items-center gap-2 bg-brand-600 text-white text-sm font-semibold px-4 py-2 rounded-lg disabled:opacity-50"
        >
          {isRunning ? <Loader2 size={16} className="animate-spin" /> : <Play size={16} />}
          {isRunning ? "Running..." : "Run Payroll"}
        </button>
      </div>

      {run.status !== "idle" && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1.5">
            <span>
              {run.status === "completed"
                ? "Completed"
                : run.status === "failed"
                ? "Failed"
                : `Processing ${run.processed} / ${run.total} employees...`}
            </span>
            <span>{percent}%</span>
          </div>
          <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${
                run.status === "failed" ? "bg-rose-500" : "bg-brand-600"
              }`}
              style={{ width: `${percent}%` }}
            />
          </div>

          {run.status === "completed" && (
            <p className="flex items-center gap-1.5 text-xs text-emerald-600 mt-2">
              <CheckCircle2 size={14} /> Sab payslips generate ho gaye — table refresh ho chuki hai.
            </p>
          )}
          {run.status === "failed" && (
            <p className="flex items-center gap-1.5 text-xs text-rose-500 mt-2">
              <AlertTriangle size={14} /> Kuch employees process nahi ho paaye.
            </p>
          )}
        </div>
      )}
    </div>
  );
}