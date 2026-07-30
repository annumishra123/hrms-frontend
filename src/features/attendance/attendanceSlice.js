
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import { getAttendanceOverview } from "../../api/attendanceApi";

// // Dashboard: today's stats + weekly trend + today's log (fetched once on mount)
// export const fetchAttendance = createAsyncThunk(
//   "attendance/fetch",
//   async (_, { rejectWithValue }) => {
//     try {
//       const res = await getAttendanceOverview();
//       return res.data; // { today, trend, log }
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || "Failed to load attendance");
//     }
//   }
// );

// // Monthly: date-wise log + per-employee summary (refetched every time month changes)
// export const fetchMonthlyAttendance = createAsyncThunk(
//   "attendance/fetchMonthly",
//   async ({ month, year }, { rejectWithValue }) => {
//     try {
//       const res = await getMonthlyAttendance(month, year);
//       return res.data; // { monthlyLog: [{date, records:[...]}], summary: [{id,name,avatar,present,absent,halfDay,onLeave,totalHours}] }
//     } catch (err) {
//       return rejectWithValue(err?.response?.data?.message || "Failed to load monthly attendance");
//     }
//   }
// );

// const attendanceSlice = createSlice({
//   name: "attendance",
//   initialState: {
//     today: null,
//     trend: [],
//     log: [],
//     status: "idle",
//     error: null,

//     monthlyLog: [],
//     summary: [],
//     monthStatus: "idle",
//     monthError: null,
//   },
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // dashboard
//       .addCase(fetchAttendance.pending, (state) => {
//         state.status = "loading";
//         state.error = null;
//       })
//       .addCase(fetchAttendance.fulfilled, (state, action) => {
//         state.status = "succeeded";
//         state.today = action.payload.today;
//         state.trend = action.payload.trend;
//         state.log = action.payload.log;
//       })
//       .addCase(fetchAttendance.rejected, (state, action) => {
//         state.status = "failed";
//         state.error = action.payload;
//       })
//       // monthly
//       .addCase(fetchMonthlyAttendance.pending, (state) => {
//         state.monthStatus = "loading";
//         state.monthError = null;
//       })
//       .addCase(fetchMonthlyAttendance.fulfilled, (state, action) => {
//         state.monthStatus = "succeeded";
//         state.monthlyLog = action.payload.monthlyLog;
//         state.summary = action.payload.summary;
//       })
//       .addCase(fetchMonthlyAttendance.rejected, (state, action) => {
//         state.monthStatus = "failed";
//         state.monthError = action.payload;
//       });
//   },
// });

// export default attendanceSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAttendanceOverview, getMonthlyAttendance } from "../../api/attendanceApi";

// Dashboard: today's stats + weekly trend + today's log
export const fetchAttendance = createAsyncThunk(
  "attendance/fetch",
  async (_, { rejectWithValue }) => {
    try {
      const res = await getAttendanceOverview();
      return res.data.data; // ⚠️ backend { success, data: {today, trend, log} } bhejta hai — .data.data zaroori hai
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load attendance");
    }
  }
);

// Monthly: date-wise log + per-employee summary
export const fetchMonthlyAttendance = createAsyncThunk(
  "attendance/fetchMonthly",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const res = await getMonthlyAttendance(month, year);
      return res.data.data; // ⚠️ yahan bhi { success, data: {monthlyLog, summary} } hai
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load monthly attendance");
    }
  }
);

const attendanceSlice = createSlice({
  name: "attendance",
  initialState: {
    today: null,
    trend: [],
    log: [],
    status: "idle",
    error: null,

    monthlyLog: [],
    summary: [],
    monthStatus: "idle",
    monthError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAttendance.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchAttendance.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.today = action.payload.today;
        state.trend = action.payload.trend;
        state.log = action.payload.log;
      })
      .addCase(fetchAttendance.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload;
      })
      .addCase(fetchMonthlyAttendance.pending, (state) => {
        state.monthStatus = "loading";
        state.monthError = null;
      })
      .addCase(fetchMonthlyAttendance.fulfilled, (state, action) => {
        state.monthStatus = "succeeded";
        state.monthlyLog = action.payload.monthlyLog;
        state.summary = action.payload.summary;
      })
      .addCase(fetchMonthlyAttendance.rejected, (state, action) => {
        state.monthStatus = "failed";
        state.monthError = action.payload;
      });
  },
});

export default attendanceSlice.reducer;