import {
  createSlice,
  createAsyncThunk,
} from "@reduxjs/toolkit";

import {
  getLeaveRequests,
  updateLeaveStatus,
} from "../../api/leaveApi";


const mapLeaveToUI = (item) => ({
  id: item._id,
  name: item.employee?.name || "Unknown Employee",
  employeeId: item.employee?.employeeId || "",
  designation: item.employee?.designation || "",
  avatar: item.employee?.profilePhoto || "",
  type: item.leaveType,
  from: item.fromDate,
  to: item.toDate,
  days: item.numberOfDays,
  reason: item.reason,
  status:
    item.status === "pending"
      ? "Pending"
      : item.status === "approved"
        ? "Approved"
        : item.status === "rejected"
          ? "Rejected"
          : "Cancelled",

  appliedOn: item.createdAt,
  raw: item,
});


// Get Leave Requests
export const fetchLeaveRequests = createAsyncThunk(
  "leave/fetchLeaveRequests",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getLeaveRequests("all");

      return response.data || [];
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to fetch leave requests"
      );
    }
  }
);


// Approve / Reject
export const decideLeaveRequest = createAsyncThunk(
  "leave/decideLeaveRequest",
  async ({ id, action }, { rejectWithValue }) => {
    try {
      const response = await updateLeaveStatus(id, action);

      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
        "Failed to update leave"
      );
    }
  }
);


const initialState = {
  requests: [],
  balance: null,
  status: "idle",
  error: null,
  filter: "Pending",
};


const leaveSlice = createSlice({
  name: "leave",

  initialState,

  reducers: {
    setLeaveFilter: (state, action) => {
      state.filter = action.payload;
    },

    addLeaveRealtime: (state, action) => {
      const mapped = mapLeaveToUI(action.payload);
      const exists = state.requests.some(
        (r) => r.id === mapped.id
      );

      if (!exists) {
        state.requests.unshift(mapped);
      }
    },

    updateLeaveRealtime: (state, action) => {
      const mapped = mapLeaveToUI(action.payload);

      const idx = state.requests.findIndex(
        (r) => r.id === mapped.id
      );

      if (idx !== -1) {
        state.requests[idx] = mapped;
      } else {
        state.requests.unshift(mapped);
      }
    },
  },

  extraReducers: (builder) => {
    builder

      // Fetch
      .addCase(fetchLeaveRequests.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })

      .addCase(fetchLeaveRequests.fulfilled, (state, action) => {
        state.status = "succeeded";

        state.requests = action.payload.map(mapLeaveToUI);
      })

      .addCase(fetchLeaveRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          action.payload || action.error.message;
      })


      // Approve / Reject
      .addCase(decideLeaveRequest.pending, (state) => {
        state.status = "loading";
      })

      .addCase(decideLeaveRequest.fulfilled, (state, action) => {
        state.status = "succeeded";

        const updated = action.payload;

        const req = state.requests.find(
          (r) => r.id === updated._id
        );

        if (req) {
          req.status =
            updated.status === "approved"
              ? "Approved"
              : "Rejected";
        }
      })

      .addCase(decideLeaveRequest.rejected, (state, action) => {
        state.status = "failed";

        state.error =
          action.payload || action.error.message;
      });
  },
});


export const {
  setLeaveFilter,
  addLeaveRealtime,
  updateLeaveRealtime,
} = leaveSlice.actions;

export default leaveSlice.reducer;