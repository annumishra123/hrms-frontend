import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  getAllRegularizeRequests,
  getRegularizeRequestById,
  approveRegularizeRequest as approveApi,
  rejectRegularizeRequest as rejectApi,
} from "../../api/regularizeApi";

const REASON_LABELS = {
  forgot_checkin: "Forgot to Check In",
  forgot_checkout: "Forgot to Check Out",
  wrong_time: "Wrong Time Recorded",
  wfh_not_marked: "WFH Not Marked",
  other: "Other",
};

const mapRequestToUI = (item) => ({
  id: item._id,
  employeeId: item.employee?._id,
  employeeName: item.employee?.name || "—",
  employeeCode: item.employee?.employeeId || "",
  department: item.employee?.department || "",
  profileImage: item.employee?.profileImage || null,
  date: item.date,
  reason: item.reason,
  reasonLabel: REASON_LABELS[item.reason] || item.reason,
  requestedCheckInTime: item.requestedCheckInTime || null,
  requestedCheckOutTime: item.requestedCheckOutTime || null,
  note: item.note,
  status: item.status,
  managerComment: item.managerComment || null,
  reviewedAt: item.reviewedAt,
  createdAt: item.createdAt,
  raw: item, // original object, detail modal ke liye
});

// ---------- Thunks ----------

export const fetchAllRegularizeRequests = createAsyncThunk(
  "regularize/fetchAll",
  async (status, { rejectWithValue }) => {
    try {
      const res = await getAllRegularizeRequests(status);
      return (res.data.data || []).map(mapRequestToUI);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Could not load requests.");
    }
  }
);

export const fetchRegularizeDetail = createAsyncThunk(
  "regularize/fetchDetail",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getRegularizeRequestById(id);
      return res.data.data; // { request, currentAttendance }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Could not load request.");
    }
  }
);

export const approveRegularizeRequest = createAsyncThunk(
  "regularize/approve",
  async ({ id, managerComment }, { rejectWithValue }) => {
    try {
      const res = await approveApi(id, managerComment);
      return mapRequestToUI(res.data.data);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to approve the request.");
    }
  }
);

export const rejectRegularizeRequest = createAsyncThunk(
  "regularize/reject",
  async ({ id, managerComment }, { rejectWithValue }) => {
    try {
      const res = await rejectApi(id, managerComment);
      return mapRequestToUI(res.data.data);
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to reject the request.");
    }
  }
);

// ---------- Slice ----------

const regularizeSlice = createSlice({
  name: "regularize",
  initialState: {
    list: [],
    status: "idle",       // list loading status
    error: null,

    detail: null,          // { request, currentAttendance }
    detailStatus: "idle",
    detailError: null,

    actionStatus: "idle",  // approve/reject loading status
    actionError: null,
  },
  reducers: {
    // 🔴 Realtime: naya request socket se aaya
    addRegularizeRealtime: (state, action) => {
      const mapped = mapRequestToUI(action.payload);
      const exists = state.list.some((r) => r.id === mapped.id);
      if (!exists) state.list.unshift(mapped);
    },

    // 🔴 Realtime: koi request approve/reject hua (kisi aur admin ne bhi ho sakta hai)
    updateRegularizeRealtime: (state, action) => {
      const mapped = mapRequestToUI(action.payload);
      const idx = state.list.findIndex((r) => r.id === mapped.id);
      if (idx !== -1) {
        state.list[idx] = mapped;
      } else {
        state.list.unshift(mapped);
      }
      if (state.detail?.request?._id === mapped.id) {
        state.detail.request = action.payload;
      }
    },

    clearRegularizeDetail: (state) => {
      state.detail = null;
      state.detailStatus = "idle";
      state.detailError = null;
    },

    clearRegularizeActionError: (state) => {
      state.actionError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // ---- fetch all ----
      .addCase(fetchAllRegularizeRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAllRegularizeRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchAllRegularizeRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })

      // ---- fetch detail ----
      .addCase(fetchRegularizeDetail.pending, (state) => {
        state.detailStatus = "loading";
        state.detailError = null;
        state.detail = null;
      })
      .addCase(fetchRegularizeDetail.fulfilled, (state, action) => {
        state.detailStatus = "succeeded";
        state.detail = action.payload;
      })
      .addCase(fetchRegularizeDetail.rejected, (state, action) => {
        state.detailStatus = "failed";
        state.detailError = action.payload;
      })

      // ---- approve ----
      .addCase(approveRegularizeRequest.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(approveRegularizeRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const idx = state.list.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(approveRegularizeRequest.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      })

      // ---- reject ----
      .addCase(rejectRegularizeRequest.pending, (state) => {
        state.actionStatus = "loading";
        state.actionError = null;
      })
      .addCase(rejectRegularizeRequest.fulfilled, (state, action) => {
        state.actionStatus = "succeeded";
        const idx = state.list.findIndex((r) => r.id === action.payload.id);
        if (idx !== -1) state.list[idx] = action.payload;
      })
      .addCase(rejectRegularizeRequest.rejected, (state, action) => {
        state.actionStatus = "failed";
        state.actionError = action.payload;
      });
  },
});

export const {
  addRegularizeRealtime,
  updateRegularizeRealtime,
  clearRegularizeDetail,
  clearRegularizeActionError,
} = regularizeSlice.actions;

export default regularizeSlice.reducer;