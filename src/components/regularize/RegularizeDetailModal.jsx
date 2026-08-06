import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { X, CheckCircle2, XCircle, LogIn, LogOut } from "lucide-react";
import {
  fetchRegularizeDetail,
  approveRegularizeRequest,
  rejectRegularizeRequest,
  clearRegularizeDetail,
  clearRegularizeActionError,
} from "../../features/regularize/regularizeSlice";

const REASON_LABELS = {
  forgot_checkin: "Forgot to Check In",
  forgot_checkout: "Forgot to Check Out",
  wrong_time: "Wrong Time Recorded",
  wfh_not_marked: "WFH Not Marked",
  other: "Other",
};

function formatTime(iso) {
  if (!iso) return "--:--";
  return new Date(iso).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: true });
}

export default function RegularizeDetailModal({ requestId, onClose }) {
  const dispatch = useDispatch();
  const { detail, detailStatus, detailError, actionStatus, actionError } = useSelector((s) => s.regularize);

  const [showRejectBox, setShowRejectBox] = useState(false);
  const [comment, setComment] = useState("");

  useEffect(() => {
    dispatch(fetchRegularizeDetail(requestId));
    return () => {
      dispatch(clearRegularizeDetail());
    };
  }, [dispatch, requestId]);

  const request = detail?.request;
  const attendance = detail?.currentAttendance;
  const actionLoading = actionStatus === "loading";

  const handleApprove = async () => {
    const res = await dispatch(approveRegularizeRequest({ id: requestId, managerComment: null }));
    if (approveRegularizeRequest.fulfilled.match(res)) onClose();
  };

  const handleReject = async () => {
    if (!comment.trim()) return;
    const res = await dispatch(rejectRegularizeRequest({ id: requestId, managerComment: comment.trim() }));
    if (rejectRegularizeRequest.fulfilled.match(res)) onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-navy-950/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between px-5 py-4 border-b border-navy-100 sticky top-0 bg-white">
          <h2 className="font-display font-bold text-navy-900">Regularization Request</h2>
          <button onClick={onClose} className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-navy-50 text-navy-400">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-5">
          {detailStatus === "loading" ? (
            <p className="text-center text-navy-400 py-8">Loading...</p>
          ) : !request ? (
            <p className="text-center text-rose-500 py-8">{detailError || "Request not found."}</p>
          ) : (
            <>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-brand-100 flex items-center justify-center text-brand-700 font-bold text-sm">
                  {request.employee?.name?.[0]?.toUpperCase() || "?"}
                </div>
                <div>
                  <p className="font-semibold text-navy-900">{request.employee?.name}</p>
                  <p className="text-xs text-navy-400">
                    {request.employee?.employeeId} · {request.employee?.department}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-navy-50 rounded-lg p-3">
                  <p className="text-xs text-navy-400 mb-1">Date</p>
                  <p className="font-semibold text-navy-900">{request.date}</p>
                </div>
                <div className="bg-navy-50 rounded-lg p-3">
                  <p className="text-xs text-navy-400 mb-1">Reason</p>
                  <p className="font-semibold text-navy-900">{REASON_LABELS[request.reason] || request.reason}</p>
                </div>
              </div>

              <div className="border border-navy-100 rounded-xl overflow-hidden">
                <div className="grid grid-cols-2 divide-x divide-navy-100">
                  <div className="p-3">
                    <p className="text-xs font-semibold text-navy-400 mb-2">Currently Recorded</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-1.5 text-navy-600">
                        <LogIn size={13} /> {formatTime(attendance?.checkIn?.time)}
                      </div>
                      <div className="flex items-center gap-1.5 text-navy-600">
                        <LogOut size={13} /> {formatTime(attendance?.checkOut?.time)}
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-brand-50/50">
                    <p className="text-xs font-semibold text-brand-600 mb-2">Requested</p>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex items-center gap-1.5 text-navy-800 font-medium">
                        <LogIn size={13} /> {request.requestedCheckInTime || "—"}
                      </div>
                      <div className="flex items-center gap-1.5 text-navy-800 font-medium">
                        <LogOut size={13} /> {request.requestedCheckOutTime || "—"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-navy-400 mb-1.5">Employee's Note</p>
                <p className="text-sm text-navy-700 bg-navy-50 rounded-lg p-3">{request.note}</p>
              </div>

              {request.status !== "pending" && (
                <div className="text-sm">
                  <span
                    className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${
                      request.status === "approved"
                        ? "bg-emerald-50 text-emerald-700"
                        : "bg-rose-50 text-rose-700"
                    }`}
                  >
                    {request.status === "approved" ? "Approved" : "Rejected"}
                  </span>
                  {request.managerComment && (
                    <p className="text-navy-500 mt-2">{request.managerComment}</p>
                  )}
                </div>
              )}

              {actionError && <p className="text-sm text-rose-500">{actionError}</p>}

              {request.status === "pending" && (
                <div className="space-y-3 pt-2">
                  {showRejectBox && (
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Reason for rejection..."
                      rows={3}
                      className="w-full text-sm border border-navy-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-rose-300"
                    />
                  )}
                  <div className="flex gap-3">
                    {!showRejectBox ? (
                      <>
                        <button
                          onClick={handleApprove}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 disabled:opacity-60 transition-colors"
                        >
                          <CheckCircle2 size={16} /> {actionLoading ? "Approving..." : "Approve"}
                        </button>
                        <button
                          onClick={() => setShowRejectBox(true)}
                          disabled={actionLoading}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg border border-rose-300 text-rose-600 text-sm font-semibold hover:bg-rose-50 disabled:opacity-60 transition-colors"
                        >
                          <XCircle size={16} /> Reject
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => {
                            setShowRejectBox(false);
                            setComment("");
                            dispatch(clearRegularizeActionError());
                          }}
                          disabled={actionLoading}
                          className="flex-1 py-2.5 rounded-lg border border-navy-200 text-navy-600 text-sm font-semibold hover:bg-navy-50"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={handleReject}
                          disabled={actionLoading || !comment.trim()}
                          className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg bg-rose-600 text-white text-sm font-semibold hover:bg-rose-700 disabled:opacity-60"
                        >
                          {actionLoading ? "Rejecting..." : "Confirm Reject"}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}