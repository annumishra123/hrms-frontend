const MAP = {
  Active: "bg-teal-50 text-teal-700",
  Present: "bg-teal-50 text-teal-700",
  Approved: "bg-teal-50 text-teal-700",
  Paid: "bg-teal-50 text-teal-700",
  Verified: "bg-teal-50 text-teal-700",
  Open: "bg-teal-50 text-teal-700",
  Offered: "bg-teal-50 text-teal-700",
  "On Leave": "bg-amber-50 text-amber-700",
  Pending: "bg-amber-50 text-amber-700",
  "Half Day": "bg-amber-50 text-amber-700",
  "On Hold": "bg-amber-50 text-amber-700",
  "Pending Review": "bg-amber-50 text-amber-700",
  Interview: "bg-brand-50 text-brand-700",
  Shortlisted: "bg-violet-50 text-violet-700",
  Applied: "bg-slate-100 text-slate-600",
  Inactive: "bg-slate-100 text-slate-500",
  Absent: "bg-rose-50 text-rose-600",
  Rejected: "bg-rose-50 text-rose-600",
};

export default function Badge({ children }) {
  const cls = MAP[children] || "bg-slate-100 text-slate-600";
  return <span className={`badge ${cls}`}>{children}</span>;
}
