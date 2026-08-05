// import { useState, useEffect, useMemo, useCallback } from "react";
// import { useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";
// import { Receipt, RefreshCw, Clock, CalendarCheck, CalendarX, Wallet } from "lucide-react";
// import api from "../api/interceptor";

// import SummaryCard from "../components/expenses/SummaryCard";
// import ExpenseFilters from "../components/expenses/ExpenseFilters";
// import ExpenseTable from "../components/expenses/ExpenseTable";
// import ExpenseModal from "../components/expenses/ExpenseModal";
// import { TABS } from "../components/expenseConstants";

// export default function ExpensesPage() {
//   const [searchParams, setSearchParams] = useSearchParams();
//   const initialTab = searchParams.get("status") || "All";

//   const user = useSelector((s) => s.auth?.user);

//   const [expenses, setExpenses] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   const [tab, setTab] = useState(TABS.includes(initialTab) ? initialTab : "All");
//   const [search, setSearch] = useState("");

//   const [selectedExpense, setSelectedExpense] = useState(null);
//   const [reviewAction, setReviewAction] = useState(null);
//   const [reviewNote, setReviewNote] = useState("");
//   const [submitting, setSubmitting] = useState(false);

//   const fetchExpenses = useCallback(async () => {
//     setLoading(true);
//     setError(null);
//     try {
//       const res = await api.get("/expense", { params: { all: "true" } });
//       setExpenses(res.data.data || []);
//     } catch (err) {
//       setError(err?.response?.data?.message || "Could not load expenses");
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchExpenses();
//   }, [fetchExpenses]);

//   useEffect(() => {
//     if (tab === "All") {
//       searchParams.delete("status");
//     } else {
//       searchParams.set("status", tab);
//     }
//     setSearchParams(searchParams, { replace: true });
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [tab]);

//   const filtered = useMemo(() => {
//     return expenses
//       .filter((e) => tab === "All" || e.status === tab)
//       .filter((e) => {
//         if (!search.trim()) return true;
//         const q = search.toLowerCase();
//         return (
//           e.title?.toLowerCase().includes(q) ||
//           e.category?.toLowerCase().includes(q) ||
//           e.employee?.name?.toLowerCase().includes(q) ||
//           e.employee?.email?.toLowerCase().includes(q)
//         );
//       })
//       .sort((a, b) => new Date(b.date) - new Date(a.date));
//   }, [expenses, tab, search]);

//   const counts = useMemo(() => {
//     const pending = expenses.filter((e) => e.status === "Pending").length;
//     const approved = expenses.filter((e) => e.status === "Approved").length;
//     const rejected = expenses.filter((e) => e.status === "Rejected").length;
//     return { pending, approved, rejected, total: expenses.length };
//   }, [expenses]);

//   const getTabCount = (t) => {
//     if (t === "All") return expenses.length;
//     return expenses.filter((e) => e.status === t).length;
//   };

//   const openReview = (expense, action) => {
//     setSelectedExpense(expense);
//     setReviewAction(action);
//     setReviewNote("");
//   };

//   const closeReview = () => {
//     setSelectedExpense(null);
//     setReviewAction(null);
//     setReviewNote("");
//   };

//   const submitReview = async () => {
//     if (!selectedExpense || !reviewAction) return;
//     setSubmitting(true);
//     try {
//       const res = await api.patch(`/expense/${selectedExpense._id}/status`, {
//         status: reviewAction,
//         reviewNote,
//       });
//       setExpenses((prev) => prev.map((e) => (e._id === res.data.data._id ? res.data.data : e)));
//       closeReview();
//     } catch (err) {
//       alert(err?.response?.data?.message || "Could not update expense status");
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
//       {/* HEADER */}
//       <div className="flex items-center justify-between flex-wrap gap-3">
//         <div>
//           <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
//             <Receipt size={22} className="text-indigo-600" />
//             Expenses
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">Review and manage employee expense claims.</p>
//         </div>
//         <button
//           onClick={fetchExpenses}
//           className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm transition-colors shadow-sm"
//         >
//           <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
//           Refresh
//         </button>
//       </div>

//       {/* SUMMARY CARDS - screenshot style: count based, not currency */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         <SummaryCard label="Pending" value={counts.pending} accent="amber" icon={Clock} />
//         <SummaryCard label="Approved" value={counts.approved} accent="emerald" icon={CalendarCheck} />
//         <SummaryCard label="Rejected" value={counts.rejected} accent="red" icon={CalendarX} />
//         <SummaryCard label="Total Requests" value={counts.total} accent="purple" icon={Wallet} />
//       </div>

//       <ExpenseFilters
//         search={search}
//         setSearch={setSearch}
//         tab={tab}
//         setTab={setTab}
//         getTabCount={getTabCount}
//       />

//       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
//         <ExpenseTable
//           loading={loading}
//           error={error}
//           filtered={filtered}
//           onView={setSelectedExpense}
//           onApprove={(e) => openReview(e, "Approved")}
//           onReject={(e) => openReview(e, "Rejected")}
//         />
//       </div>

//       {selectedExpense && (
//         <ExpenseModal
//           expense={selectedExpense}
//           reviewAction={reviewAction}
//           reviewNote={reviewNote}
//           setReviewNote={setReviewNote}
//           submitting={submitting}
//           onApprove={() => openReview(selectedExpense, "Approved")}
//           onReject={() => openReview(selectedExpense, "Rejected")}
//           onSubmitReview={submitReview}
//           onClose={closeReview}
//         />
//       )}
//     </div>
//   );
// }



import { useEffect, useMemo } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { Receipt, RefreshCw, Clock, CalendarCheck, CalendarX, Wallet } from "lucide-react";

import {
  connectAdminSocket,
  listenExpenseNew,
  removeExpenseNewListener,
  listenExpenseStatusChanged,
  removeExpenseStatusChangedListener,
  listenExpenseUpdated,
  removeExpenseUpdatedListener,
  listenExpenseDeleted,
  removeExpenseDeletedListener,
} from "../services/socket";

import {
  fetchExpenses,
  updateExpenseStatus,
  expenseAddedFromSocket,
  expenseUpdatedFromSocket,
  expenseRemovedFromSocket,
  clearLatestNew,
  selectExpenses,
  selectExpensesLoading,
  selectExpensesError,
  selectLatestNewExpense,
} from "../features/expense/expenseSlice";

import SummaryCard from "../components/expenses/SummaryCard";
import ExpenseFilters from "../components/expenses/ExpenseFilters";
import ExpenseTable from "../components/expenses/ExpenseTable";
import ExpenseModal from "../components/expenses/ExpenseModal";
import NewExpenseToast from "../components/expenses/NewExpenseToast";
import { TABS } from "../components/expenseConstants";

import { useState, useCallback } from "react";

export default function ExpensesPage() {
  const dispatch = useDispatch();
  const [searchParams, setSearchParams] = useSearchParams();
  const initialTab = searchParams.get("status") || "All";

  const user = useSelector((s) => s.auth?.user);
  const token = useSelector((s) => s.auth?.token); // apne authSlice ke hisaab se adjust karo

  const expenses = useSelector(selectExpenses);
  const loading = useSelector(selectExpensesLoading);
  const error = useSelector(selectExpensesError);
  const latestNew = useSelector(selectLatestNewExpense);

  const [tab, setTab] = useState(TABS.includes(initialTab) ? initialTab : "All");
  const [search, setSearch] = useState("");

  const [selectedExpense, setSelectedExpense] = useState(null);
  const [reviewAction, setReviewAction] = useState(null);
  const [reviewNote, setReviewNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  // ---------------- INITIAL FETCH ----------------
  useEffect(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  // ---------------- REALTIME SOCKET ----------------
  useEffect(() => {
    if (!user || !token) return;

    const socket = connectAdminSocket(token, user._id || user.id);

    const onNew = (expense) => {
      dispatch(expenseAddedFromSocket(expense));
      // optional: yaha beep sound bhi bajaya ja sakta hai
    };
    const onUpdated = (expense) => dispatch(expenseUpdatedFromSocket(expense));
    const onDeleted = (payload) => dispatch(expenseRemovedFromSocket(payload.id || payload._id));

    listenExpenseNew(onNew);
    listenExpenseUpdated(onUpdated);
    listenExpenseStatusChanged(onUpdated);
    listenExpenseDeleted(onDeleted);

    return () => {
      removeExpenseNewListener(onNew);
      removeExpenseUpdatedListener(onUpdated);
      removeExpenseStatusChangedListener(onUpdated);
      removeExpenseDeletedListener(onDeleted);
    };
  }, [user, token, dispatch]);

  // sync tab -> URL query param
  useEffect(() => {
    if (tab === "All") {
      searchParams.delete("status");
    } else {
      searchParams.set("status", tab);
    }
    setSearchParams(searchParams, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tab]);

  // ---------------- FILTER / SEARCH ----------------
  const filtered = useMemo(() => {
    return expenses
      .filter((e) => tab === "All" || e.status === tab)
      .filter((e) => {
        if (!search.trim()) return true;
        const q = search.toLowerCase();
        return (
          e.title?.toLowerCase().includes(q) ||
          e.category?.toLowerCase().includes(q) ||
          e.employee?.name?.toLowerCase().includes(q) ||
          e.employee?.email?.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => new Date(b.date) - new Date(a.date));
  }, [expenses, tab, search]);

  const counts = useMemo(() => {
    const pending = expenses.filter((e) => e.status === "Pending").length;
    const approved = expenses.filter((e) => e.status === "Approved").length;
    const rejected = expenses.filter((e) => e.status === "Rejected").length;
    return { pending, approved, rejected, total: expenses.length };
  }, [expenses]);

  const getTabCount = (t) => {
    if (t === "All") return expenses.length;
    return expenses.filter((e) => e.status === t).length;
  };

  // ---------------- REVIEW ----------------
  const openReview = (expense, action) => {
    setSelectedExpense(expense);
    setReviewAction(action);
    setReviewNote("");
  };

  const closeReview = () => {
    setSelectedExpense(null);
    setReviewAction(null);
    setReviewNote("");
  };

  const submitReview = async () => {
    if (!selectedExpense || !reviewAction) return;
    setSubmitting(true);
    try {
      await dispatch(
        updateExpenseStatus({
          id: selectedExpense._id,
          status: reviewAction,
          reviewNote,
        })
      ).unwrap();
      closeReview();
    } catch (err) {
      alert(err || "Could not update expense status");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRefresh = useCallback(() => {
    dispatch(fetchExpenses());
  }, [dispatch]);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* TOAST - naya expense aane par turant dikhega */}
      <NewExpenseToast
        expense={latestNew}
        onClose={() => dispatch(clearLatestNew())}
        onView={(e) => setSelectedExpense(e)}
      />

      {/* HEADER */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Receipt size={22} className="text-indigo-600" />
            Expenses
          </h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage employee expense claims.</p>
        </div>
        <button
          onClick={handleRefresh}
          className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white border border-gray-200 hover:bg-gray-50 text-gray-600 text-sm transition-colors shadow-sm"
        >
          <RefreshCw size={15} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {/* SUMMARY CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <SummaryCard label="Pending" value={counts.pending} accent="amber" icon={Clock} />
        <SummaryCard label="Approved" value={counts.approved} accent="emerald" icon={CalendarCheck} />
        <SummaryCard label="Rejected" value={counts.rejected} accent="red" icon={CalendarX} />
        <SummaryCard label="Total Requests" value={counts.total} accent="purple" icon={Wallet} />
      </div>

      <ExpenseFilters
        search={search}
        setSearch={setSearch}
        tab={tab}
        setTab={setTab}
        getTabCount={getTabCount}
      />

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <ExpenseTable
          loading={loading}
          error={error}
          filtered={filtered}
          onView={setSelectedExpense}
          onApprove={(e) => openReview(e, "Approved")}
          onReject={(e) => openReview(e, "Rejected")}
        />
      </div>

      {selectedExpense && (
        <ExpenseModal
          expense={selectedExpense}
          reviewAction={reviewAction}
          reviewNote={reviewNote}
          setReviewNote={setReviewNote}
          submitting={submitting}
          onApprove={() => openReview(selectedExpense, "Approved")}
          onReject={() => openReview(selectedExpense, "Rejected")}
          onSubmitReview={submitReview}
          onClose={closeReview}
        />
      )}
    </div>
  );
}