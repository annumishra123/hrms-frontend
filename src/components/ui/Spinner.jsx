export default function Spinner({ full = false, label = "Loading..." }) {
  if (full) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 py-24 w-full">
        <div className="h-9 w-9 rounded-full border-[3px] border-slate-200 border-t-navy-700 animate-spin" />
        <p className="text-sm text-slate-400 font-medium">{label}</p>
      </div>
    );
  }
  return <div className="h-4 w-4 rounded-full border-2 border-white/40 border-t-white animate-spin" />;
}
