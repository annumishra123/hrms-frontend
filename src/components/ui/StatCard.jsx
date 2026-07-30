export default function StatCard({ icon: Icon, label, value, sub, tone = "brand", trend }) {
  const tones = {
    brand: "bg-brand-50 text-brand-700",
    teal: "bg-teal-50 text-teal-600",
    amber: "bg-amber-50 text-amber-600",
    rose: "bg-rose-50 text-rose-600",
    violet: "bg-violet-50 text-violet-600",
    navy: "bg-navy-50 text-navy-700",
  };

  return (
    <div className="card p-5 flex items-start justify-between gap-3 min-w-0">
      <div className="min-w-0">
        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide truncate">{label}</p>
        <p className="mt-2 text-2xl font-display font-bold text-slate-800 truncate">{value}</p>
        {sub && <p className="mt-1 text-xs text-slate-400">{sub}</p>}
        {trend && (
          <p className={`mt-1 text-xs font-semibold ${trend.startsWith("-") ? "text-rose-500" : "text-teal-600"}`}>
            {trend}
          </p>
        )}
      </div>
      {Icon && (
        <div className={`shrink-0 h-11 w-11 rounded-xl flex items-center justify-center ${tones[tone]}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
      )}
    </div>
  );
}
