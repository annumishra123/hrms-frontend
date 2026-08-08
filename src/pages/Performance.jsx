import { useEffect, useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Star,
  Target,
  Search,
  Users,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Plus,
  ChevronDown,
  ChevronUp,
  X,
  Award,
} from "lucide-react";
import {
  fetchReviewCycles,
  fetchPerformanceStats,
  fetchAllReviews,
  fetchAllOkrs,
  submitReviewRating,
  finalizeReview,
  createOkrForEmployee,
  updateKeyResultProgress,
  searchEmployeesForOkr,
  clearEmployeeSearch,
  setActiveCycle,
} from "../features/performance/performanceSlice";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import Spinner from "../components/ui/Spinner";
import Avatar from "../components/ui/Avatar";
import Modal from "../components/ui/Modal";
import EmptyState from "../components/ui/EmptyState";

const PAGE_SIZE_OPTIONS = [25, 50, 100];

const RATING_TYPES = [
  { key: "self", label: "Self" },
  { key: "manager", label: "Manager" },
  { key: "peer", label: "Peer" },
  { key: "directReports", label: "Direct Reports" },
];

const STATUS_STYLE = {
  "in-progress": "bg-slate-100 text-slate-500",
  submitted: "bg-amber-50 text-amber-700",
  finalized: "bg-teal-50 text-teal-700",
};

function currentQuarterLabel() {
  const now = new Date();
  const q = Math.floor(now.getMonth() / 3) + 1;
  return `Q${q} ${now.getFullYear()}`;
}

function Stars({ value }) {
  const v = value || 0;
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star key={i} size={14} className={i <= Math.round(v) ? "fill-amber-400 text-amber-400" : "text-slate-200"} />
      ))}
      <span className="ml-1 text-xs font-semibold text-slate-600">{v ? v.toFixed(1) : "-"}</span>
    </div>
  );
}

export default function Performance() {
  const dispatch = useDispatch();
  const {
    cycles,
    activeCycle,
    stats,
    statsStatus,
    reviews,
    reviewsTotalCount,
    reviewsTotalPages,
    reviewsCurrentPage,
    reviewsStatus,
    okrs,
    okrsTotalCount,
    okrsTotalPages,
    okrsCurrentPage,
    okrsStatus,
    actionStatus,
    employeeSearchResults,
    employeeSearchStatus,
  } = useSelector((s) => s.performance);

  const [tab, setTab] = useState("reviews"); // reviews | okrs
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(25);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [expandedOkr, setExpandedOkr] = useState(null);
  const [toast, setToast] = useState("");

  // Rate modal
  const [rateTarget, setRateTarget] = useState(null); // review row
  const [rateForm, setRateForm] = useState({ ratingType: "manager", rating: 5, feedback: "" });

  // Create OKR modal
  const [okrModalOpen, setOkrModalOpen] = useState(false);
  const [empSearch, setEmpSearch] = useState("");
  const [selectedEmp, setSelectedEmp] = useState(null);
  const [okrForm, setOkrForm] = useState({ objective: "", keyResults: [{ title: "", progress: 0 }] });

  // Key result edit
  const [krEditTarget, setKrEditTarget] = useState(null); // { okrId, index, currentProgress }

  // ---- init: cycles fetch, default to current quarter ----
  useEffect(() => {
    dispatch(fetchReviewCycles()).then((res) => {
      const list = res.payload || [];
      const thisQuarter = currentQuarterLabel();
      if (!list.includes(thisQuarter)) {
        dispatch(setActiveCycle(thisQuarter));
      }
    });
  }, [dispatch]);

  // ---- search debounce ----
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 400);
    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, tab, activeCycle, limit]);

  // ---- fetch stats + list whenever cycle/tab/page changes ----
  useEffect(() => {
    if (!activeCycle) return;
    dispatch(fetchPerformanceStats(activeCycle));
  }, [dispatch, activeCycle]);

  useEffect(() => {
    if (!activeCycle) return;
    if (tab === "reviews") {
      dispatch(fetchAllReviews({ cycle: activeCycle, page, limit, search, status: statusFilter }));
    } else {
      dispatch(fetchAllOkrs({ cycle: activeCycle, page, limit, search }));
    }
  }, [dispatch, activeCycle, tab, page, limit, search, statusFilter]);

  // ---- employee search debounce (Create OKR modal) ----
  useEffect(() => {
    if (!okrModalOpen) return;
    const timer = setTimeout(() => {
      if (empSearch.trim()) dispatch(searchEmployeesForOkr(empSearch));
      else dispatch(clearEmployeeSearch());
    }, 350);
    return () => clearTimeout(timer);
  }, [empSearch, okrModalOpen, dispatch]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  // ---- Rate submit ----
  const handleRateSubmit = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        submitReviewRating({
          employeeId: rateTarget.employee._id,
          reviewCycle: activeCycle,
          ratingType: rateForm.ratingType,
          rating: Number(rateForm.rating),
          feedback: rateForm.feedback,
        })
      ).unwrap();
      showToast(`${rateTarget.employee.name} ka rating save ho gaya.`);
      setRateTarget(null);
      dispatch(fetchPerformanceStats(activeCycle));
    } catch (err) {
      showToast(typeof err === "string" ? err : "Rating save nahi ho payi");
    }
  };

  const handleFinalize = async (review) => {
    try {
      await dispatch(finalizeReview(review._id)).unwrap();
      showToast(`${review.employee.name} ka review finalize ho gaya.`);
      dispatch(fetchPerformanceStats(activeCycle));
    } catch (err) {
      showToast(typeof err === "string" ? err : "Finalize nahi ho paaya");
    }
  };

  // ---- Create OKR ----
  const addKeyResultRow = () => {
    setOkrForm({ ...okrForm, keyResults: [...okrForm.keyResults, { title: "", progress: 0 }] });
  };
  const removeKeyResultRow = (i) => {
    setOkrForm({ ...okrForm, keyResults: okrForm.keyResults.filter((_, idx) => idx !== i) });
  };
  const updateKeyResultRow = (i, field, value) => {
    const kr = [...okrForm.keyResults];
    kr[i] = { ...kr[i], [field]: value };
    setOkrForm({ ...okrForm, keyResults: kr });
  };

  const resetOkrModal = () => {
    setOkrModalOpen(false);
    setSelectedEmp(null);
    setEmpSearch("");
    setOkrForm({ objective: "", keyResults: [{ title: "", progress: 0 }] });
    dispatch(clearEmployeeSearch());
  };

  const handleCreateOkr = async (e) => {
    e.preventDefault();
    if (!selectedEmp) return showToast("Pehle ek employee select karo");
    try {
      await dispatch(
        createOkrForEmployee({
          employeeId: selectedEmp._id,
          quarter: activeCycle,
          objective: okrForm.objective,
          keyResults: okrForm.keyResults.filter((kr) => kr.title.trim()),
        })
      ).unwrap();
      showToast(`${selectedEmp.name} ke liye OKR ban gayi.`);
      resetOkrModal();
      dispatch(fetchPerformanceStats(activeCycle));
    } catch (err) {
      showToast(typeof err === "string" ? err : "OKR create nahi ho payi");
    }
  };

  // ---- Key result progress update ----
  const handleUpdateKR = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        updateKeyResultProgress({
          okrId: krEditTarget.okrId,
          keyResultIndex: krEditTarget.index,
          progress: Number(krEditTarget.currentProgress),
        })
      ).unwrap();
      showToast("Progress update ho gaya.");
      setKrEditTarget(null);
      dispatch(fetchPerformanceStats(activeCycle));
    } catch (err) {
      showToast(typeof err === "string" ? err : "Update nahi ho paaya");
    }
  };

  const totalPages = tab === "reviews" ? reviewsTotalPages : okrsTotalPages;
  const currentPage = tab === "reviews" ? reviewsCurrentPage : okrsCurrentPage;
  const totalCount = tab === "reviews" ? reviewsTotalCount : okrsTotalCount;
  const loading = tab === "reviews" ? reviewsStatus === "loading" : okrsStatus === "loading";

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
        <PageHeader title="Performance & OKRs" subtitle="360° review ratings and objective tracking." />
        <div className="flex items-center gap-2">
          <select
            value={activeCycle}
            onChange={(e) => dispatch(setActiveCycle(e.target.value))}
            className="input md:w-48"
          >
            {!cycles.includes(currentQuarterLabel()) && (
              <option value={currentQuarterLabel()}>{currentQuarterLabel()} (naya)</option>
            )}
            {cycles.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {tab === "okrs" && (
            <button onClick={() => setOkrModalOpen(true)} className="btn-primary">
              <Plus size={16} /> Assign OKR
            </button>
          )}
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="fixed top-6 right-6 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="rounded-xl bg-teal-50 text-teal-700 text-sm px-4 py-3 shadow-lg border border-teal-100 flex items-center gap-2 max-w-sm">
            <CheckCircle2 size={16} className="shrink-0" />
            <span className="flex-1">{toast}</span>
            <button onClick={() => setToast("")}><X size={15} /></button>
          </div>
        </div>
      )}

      {/* Stats */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard icon={Users} label="Total Employees" value={stats.totalEmployees} tone="brand" />
          <StatCard icon={CheckCircle2} label="Reviews Submitted" value={`${stats.reviewsSubmitted}/${stats.totalEmployees}`} tone="teal" />
          <StatCard icon={Award} label="Finalized" value={stats.reviewsFinalized} tone="violet" />
          <StatCard icon={Star} label="Avg Rating" value={stats.avgRating || "-"} tone="amber" />
          <StatCard icon={Target} label="Avg OKR Progress" value={`${stats.avgOkrProgress}%`} tone="teal" />
        </div>
      )}

      {stats && (stats.lowPerformers > 0 || stats.employeesWithoutOkr > 0) && (
        <div className="flex flex-wrap gap-3 mb-5">
          {stats.lowPerformers > 0 && (
            <div className="flex items-center gap-2 text-amber-700 bg-amber-50 border border-amber-100 rounded-xl px-4 py-2.5 text-sm">
              <AlertTriangle size={15} />
              {stats.lowPerformers} employees ka rating 3.0 se kam hai
            </div>
          )}
          {stats.employeesWithoutOkr > 0 && (
            <div className="flex items-center gap-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm">
              <Target size={15} />
              {stats.employeesWithoutOkr} Employees' OKRs have not been set for this quarter.
            </div>
          )}
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center justify-between flex-wrap gap-3 mb-4">
        <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-fit">
          <button
            onClick={() => setTab("reviews")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === "reviews" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            360° Reviews
          </button>
          <button
            onClick={() => setTab("okrs")}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
              tab === "okrs" ? "bg-white text-navy-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
            }`}
          >
            OKRs
          </button>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search employee..."
              className="pl-8 pr-3 py-2 text-sm rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-200 w-56"
            />
          </div>
          {tab === "reviews" && (
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="input !w-auto text-sm">
              <option value="">All Status</option>
              <option value="in-progress">In Progress</option>
              <option value="submitted">Submitted</option>
              <option value="finalized">Finalized</option>
            </select>
          )}
          <select value={limit} onChange={(e) => setLimit(Number(e.target.value))} className="input !w-auto text-sm">
            {PAGE_SIZE_OPTIONS.map((n) => <option key={n} value={n}>{n}/page</option>)}
          </select>
        </div>
      </div>

      {/* ===== Reviews Tab ===== */}
      {tab === "reviews" && (
        <div className="card overflow-hidden">
          {loading ? (
            <Spinner full label="Loading reviews..." />
          ) : reviews.length === 0 ? (
            <EmptyState icon={Star} title="No reviews found" subtitle="Try a different cycle or search." />
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50">
                    <tr>
                      <th className="table-th">Employee</th>
                      <th className="table-th">Self</th>
                      <th className="table-th">Manager</th>
                      <th className="table-th">Peer</th>
                      <th className="table-th">Overall</th>
                      <th className="table-th">Status</th>
                      <th className="table-th text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reviews.map((r) => (
                      <tr key={r._id} className="hover:bg-slate-50/70">
                        <td className="table-td">
                          <div className="flex items-center gap-3">
                            <Avatar src={r.employee?.profilePhoto} name={r.employee?.name} size={32} />
                            <div>
                              <p className="font-semibold text-slate-700">{r.employee?.name}</p>
                              <p className="text-xs text-slate-400">{r.employee?.designation}</p>
                            </div>
                          </div>
                        </td>
                        <td className="table-td text-slate-500">{r.selfRating ?? "-"}</td>
                        <td className="table-td text-slate-500">{r.managerRating ?? "-"}</td>
                        <td className="table-td text-slate-500">{r.peerRating ?? "-"}</td>
                        <td className="table-td"><Stars value={r.overallRating} /></td>
                        <td className="table-td">
                          <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_STYLE[r.status]}`}>
                            {r.status}
                          </span>
                        </td>
                        <td className="table-td text-right">
                          <div className="flex items-center justify-end gap-3">
                            <button
                              onClick={() => setRateTarget(r)}
                              className="text-brand-600 font-semibold text-sm hover:underline"
                            >
                              Rate
                            </button>
                            {r.status === "submitted" && (
                              <button
                                onClick={() => handleFinalize(r)}
                                className="text-teal-600 font-semibold text-sm hover:underline"
                              >
                                Finalize
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination page={currentPage} totalPages={totalPages} totalCount={totalCount} setPage={setPage} />
            </>
          )}
        </div>
      )}

      {/* ===== OKRs Tab ===== */}
      {tab === "okrs" && (
        <div className="card overflow-hidden">
          {loading ? (
            <Spinner full label="Loading OKRs..." />
          ) : okrs.length === 0 ? (
            <EmptyState icon={Target} title="No OKRs found" subtitle="Assign an OKR to get started." />
          ) : (
            <>
              <div className="divide-y divide-slate-100">
                {okrs.map((o) => {
                  const expanded = expandedOkr === o._id;
                  return (
                    <div key={o._id} className="p-4">
                      <div
                        className="flex items-center justify-between cursor-pointer"
                        onClick={() => setExpandedOkr(expanded ? null : o._id)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <Avatar src={o.employee?.profilePhoto} name={o.employee?.name} size={36} />
                          <div className="min-w-0">
                            <p className="font-semibold text-slate-700 truncate">{o.employee?.name}</p>
                            <p className="text-xs text-slate-400 truncate">{o.objective}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-sm font-bold text-brand-700">{o.overallProgress}%</span>
                          {expanded ? <ChevronUp size={16} className="text-slate-400" /> : <ChevronDown size={16} className="text-slate-400" />}
                        </div>
                      </div>
                      <div className="h-2 rounded-full bg-slate-100 overflow-hidden mt-3">
                        <div
                          className="h-full bg-gradient-to-r from-brand-500 to-brand-700 rounded-full"
                          style={{ width: `${o.overallProgress}%` }}
                        />
                      </div>

                      {expanded && (
                        <div className="mt-4 pl-11 space-y-3">
                          {o.keyResults.map((kr, i) => (
                            <div key={i}>
                              <div className="flex items-center justify-between text-xs mb-1">
                                <span className="text-slate-600">{kr.title}</span>
                                <button
                                  onClick={() =>
                                    setKrEditTarget({ okrId: o._id, index: i, currentProgress: kr.progress })
                                  }
                                  className="text-brand-600 font-semibold hover:underline"
                                >
                                  {kr.progress}% · Edit
                                </button>
                              </div>
                              <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                                <div className="h-full bg-teal-500 rounded-full" style={{ width: `${kr.progress}%` }} />
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
              <Pagination page={currentPage} totalPages={totalPages} totalCount={totalCount} setPage={setPage} />
            </>
          )}
        </div>
      )}

      {/* ===== Rate Modal ===== */}
      <Modal open={!!rateTarget} onClose={() => setRateTarget(null)} title={`Rate — ${rateTarget?.employee?.name || ""}`}>
        {rateTarget && (
          <form onSubmit={handleRateSubmit} className="space-y-4">
            <div>
              <label className="label">Rating Type</label>
              <select
                value={rateForm.ratingType}
                onChange={(e) => setRateForm({ ...rateForm, ratingType: e.target.value })}
                className="input"
              >
                {RATING_TYPES.map((t) => (
                  <option key={t.key} value={t.key}>{t.label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="label">Rating (1–5)</label>
              <input
                type="number"
                min="1"
                max="5"
                step="0.1"
                required
                value={rateForm.rating}
                onChange={(e) => setRateForm({ ...rateForm, rating: e.target.value })}
                className="input"
              />
            </div>
            <div>
              <label className="label">Feedback (optional)</label>
              <textarea
                rows={3}
                value={rateForm.feedback}
                onChange={(e) => setRateForm({ ...rateForm, feedback: e.target.value })}
                className="input"
                placeholder="Constructive feedback..."
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setRateTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" disabled={actionStatus === "loading"} className="btn-primary flex-1 disabled:opacity-50">
                {actionStatus === "loading" ? "Saving..." : "Save Rating"}
              </button>
            </div>
          </form>
        )}
      </Modal>

      {/* ===== Create OKR Modal ===== */}
      <Modal open={okrModalOpen} onClose={resetOkrModal} title={`Assign OKR — ${activeCycle}`}>
        <form onSubmit={handleCreateOkr} className="space-y-4">
          <div>
            <label className="label">Employee</label>
            {selectedEmp ? (
              <div className="flex items-center justify-between border border-slate-200 rounded-lg px-3 py-2">
                <div className="flex items-center gap-2">
                  <Avatar src={selectedEmp.profilePhoto} name={selectedEmp.name} size={28} />
                  <span className="text-sm font-medium text-slate-700">{selectedEmp.name}</span>
                </div>
                <button type="button" onClick={() => setSelectedEmp(null)} className="text-slate-400 hover:text-slate-600">
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="relative">
                <input
                  value={empSearch}
                  onChange={(e) => setEmpSearch(e.target.value)}
                  placeholder="Search employee by name or ID..."
                  className="input"
                />
                {empSearch && employeeSearchResults.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full bg-white border border-slate-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {employeeSearchResults.map((emp) => (
                      <button
                        type="button"
                        key={emp._id}
                        onClick={() => {
                          setSelectedEmp(emp);
                          setEmpSearch("");
                          dispatch(clearEmployeeSearch());
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 hover:bg-slate-50 text-left"
                      >
                        <Avatar src={emp.profilePhoto} name={emp.name} size={26} />
                        <div>
                          <p className="text-sm font-medium text-slate-700">{emp.name}</p>
                          <p className="text-xs text-slate-400">{emp.employeeId} · {emp.designation}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
                {empSearch && employeeSearchStatus === "succeeded" && employeeSearchResults.length === 0 && (
                  <p className="text-xs text-slate-400 mt-1">Koi employee nahi mila</p>
                )}
              </div>
            )}
          </div>

          <div>
            <label className="label">Objective</label>
            <input
              required
              value={okrForm.objective}
              onChange={(e) => setOkrForm({ ...okrForm, objective: e.target.value })}
              className="input"
              placeholder="e.g. Improve Product Quality"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="label !mb-0">Key Results</label>
              <button type="button" onClick={addKeyResultRow} className="text-xs font-semibold text-brand-600 hover:underline">
                + Add Key Result
              </button>
            </div>
            <div className="space-y-2">
              {okrForm.keyResults.map((kr, i) => (
                <div key={i} className="flex items-center gap-2">
                  <input
                    value={kr.title}
                    onChange={(e) => updateKeyResultRow(i, "title", e.target.value)}
                    className="input flex-1"
                    placeholder={`Key result ${i + 1}`}
                  />
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={kr.progress}
                    onChange={(e) => updateKeyResultRow(i, "progress", Number(e.target.value))}
                    className="input !w-20"
                    placeholder="%"
                  />
                  {okrForm.keyResults.length > 1 && (
                    <button type="button" onClick={() => removeKeyResultRow(i)} className="text-slate-400 hover:text-rose-500">
                      <X size={16} />
                    </button>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={resetOkrModal} className="btn-secondary flex-1">Cancel</button>
            <button type="submit" disabled={actionStatus === "loading"} className="btn-primary flex-1 disabled:opacity-50">
              {actionStatus === "loading" ? "Saving..." : "Create OKR"}
            </button>
          </div>
        </form>
      </Modal>

      {/* ===== Edit Key Result Progress Modal ===== */}
      <Modal open={!!krEditTarget} onClose={() => setKrEditTarget(null)} title="Update Progress">
        {krEditTarget && (
          <form onSubmit={handleUpdateKR} className="space-y-4">
            <div>
              <label className="label">Progress (%)</label>
              <input
                type="number"
                min="0"
                max="100"
                required
                value={krEditTarget.currentProgress}
                onChange={(e) => setKrEditTarget({ ...krEditTarget, currentProgress: e.target.value })}
                className="input"
              />
            </div>
            <div className="flex gap-3 pt-2">
              <button type="button" onClick={() => setKrEditTarget(null)} className="btn-secondary flex-1">Cancel</button>
              <button type="submit" className="btn-primary flex-1">Save</button>
            </div>
          </form>
        )}
      </Modal>
    </div>
  );
}

function Pagination({ page, totalPages, totalCount, setPage }) {
  return (
    <div className="px-5 py-3 border-t border-slate-100 flex items-center justify-between">
      <p className="text-xs text-slate-400">
        Page {page} of {totalPages} · {totalCount} total
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
  );
}