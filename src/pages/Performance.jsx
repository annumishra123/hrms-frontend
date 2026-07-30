import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Star, Target } from "lucide-react";
import { fetchPerformance } from "../features/performance/performanceSlice";
import PageHeader from "../components/ui/PageHeader";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";

function Stars({ value }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={15} className={i <= Math.round(value) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
      <span className="ml-1 text-sm font-semibold text-slate-600">{value.toFixed(1)}</span>
    </div>
  );
}

export default function Performance() {
  const dispatch = useDispatch();
  const { reviews, okrs, status } = useSelector((s) => s.performance);

  useEffect(() => {
    dispatch(fetchPerformance());
  }, [dispatch]);

  if (status === "loading" || !reviews.length) return <Spinner full label="Loading performance data..." />;

  return (
    <div>
      <PageHeader title="Performance & OKRs" subtitle="360° review ratings and objective tracking — Q2 2025 cycle." />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {reviews.map((r) => (
          <div key={r.empId} className="card p-5">
            <div className="flex items-center gap-3 mb-4">
              <Avatar src={r.avatar} name={r.name} size={44} />
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-slate-700 truncate">{r.name}</p>
                <p className="text-xs text-slate-400 truncate">{r.designation}</p>
              </div>
              <Stars value={r.overallRating} />
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-slate-50 rounded-lg py-2.5">
                <p className="text-xs text-slate-400">Self</p>
                <p className="font-semibold text-slate-700">{r.self}</p>
              </div>
              <div className="bg-slate-50 rounded-lg py-2.5">
                <p className="text-xs text-slate-400">Manager</p>
                <p className="font-semibold text-slate-700">{r.manager}</p>
              </div>
              <div className="bg-slate-50 rounded-lg py-2.5">
                <p className="text-xs text-slate-400">Peers</p>
                <p className="font-semibold text-slate-700">{r.peers}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Target size={18} className="text-navy-700" />
        <h3 className="font-display font-bold text-slate-800">Active OKRs</h3>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {okrs.map((o) => (
          <div key={o.id} className="card p-5">
            <div className="flex items-center justify-between mb-3">
              <p className="font-semibold text-slate-700">{o.objective}</p>
              <span className="text-sm font-bold text-brand-700">{o.progress}%</span>
            </div>
            <div className="h-2 rounded-full bg-slate-100 overflow-hidden mb-4">
              <div className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full" style={{ width: `${o.progress}%` }} />
            </div>
            <div className="space-y-2.5">
              {o.keyResults.map((kr, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-slate-500">{kr.label}</span>
                    <span className="text-slate-400 font-medium">{kr.progress}%</span>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${kr.progress}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
