import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../api/mockApi";

export const fetchReports = createAsyncThunk("reports/fetch", async () => {
  const [reports, auditLogs] = await Promise.all([api.getReports(), api.getAuditLogs()]);
  return { ...reports, auditLogs };
});

const reportsSlice = createSlice({
  name: "reports",
  initialState: {
    departmentDistribution: [],
    monthlyHiring: [],
    attritionTrend: [],
    payrollTrend: [],
    attendanceTrend: [],
    auditLogs: [],
    status: "idle",
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchReports.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchReports.fulfilled, (state, action) => {
        state.status = "succeeded";
        Object.assign(state, action.payload);
      })
      .addCase(fetchReports.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export default reportsSlice.reducer;
