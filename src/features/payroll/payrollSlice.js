
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../api/interceptor";

export const fetchPayrollOverview = createAsyncThunk(
  "payroll/fetchOverview",
  async ({ month, year }) => {
    const { data } = await api.get("/payroll/overview", { params: { month, year } });
    return data;
  }
);

export const fetchPayslips = createAsyncThunk(
  "payroll/fetchPayslips",
  async ({ page, limit, search, status, month, year }) => {
    const { data } = await api.get("/payroll/payslips", {
      params: { page, limit, search, status, month, year },
    });
    return data;
  }
);

export const downloadPayslip = createAsyncThunk(
  "payroll/downloadPayslip",
  async ({ payslipId, employeeName, month }) => {
    const response = await api.get(`/payroll/payslips/${payslipId}/pdf`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Payslip-${employeeName}-${month}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return payslipId;
  }
);

export const startPayrollRun = createAsyncThunk(
  "payroll/startRun",
  async ({ month, year }) => {
    const { data } = await api.post("/payroll/run", { month, year });
    return data;
  }
);

export const pollPayrollRunStatus = createAsyncThunk(
  "payroll/pollRunStatus",
  async (runId) => {
    const { data } = await api.get(`/payroll/run/${runId}/status`);
    return data;
  }
);

const initialState = {
  summary: null,
  trend: [],
  overviewStatus: "idle",

  payslips: [],
  totalCount: 0,
  totalPages: 1,
  currentPage: 1,
  payslipsStatus: "idle",

  downloadingId: null,

  run: {
    runId: null,
    status: "idle",
    processed: 0,
    total: 0,
    errors: [],
  },
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    resetPayrollRun(state) {
      state.run = initialState.run;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPayrollOverview.pending, (state) => { state.overviewStatus = "loading"; })
      .addCase(fetchPayrollOverview.fulfilled, (state, action) => {
        state.overviewStatus = "succeeded";
        state.summary = action.payload.summary;
        state.trend = action.payload.trend;
      })
      .addCase(fetchPayrollOverview.rejected, (state) => { state.overviewStatus = "failed"; })

      .addCase(fetchPayslips.pending, (state) => { state.payslipsStatus = "loading"; })
      .addCase(fetchPayslips.fulfilled, (state, action) => {
        state.payslipsStatus = "succeeded";
        state.payslips = action.payload.payslips;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPayslips.rejected, (state) => { state.payslipsStatus = "failed"; })

      .addCase(downloadPayslip.pending, (state, action) => {
        state.downloadingId = action.meta.arg.payslipId;
      })
      .addCase(downloadPayslip.fulfilled, (state) => { state.downloadingId = null; })
      .addCase(downloadPayslip.rejected, (state) => { state.downloadingId = null; })

      .addCase(startPayrollRun.pending, (state) => { state.run.status = "queued"; })
      .addCase(startPayrollRun.fulfilled, (state, action) => {
        state.run.runId = action.payload.runId;
        state.run.status = action.payload.status;
        state.run.total = action.payload.totalEmployees;
        state.run.processed = 0;
      })
      .addCase(startPayrollRun.rejected, (state) => { state.run.status = "failed"; })
      .addCase(pollPayrollRunStatus.fulfilled, (state, action) => {
        state.run.status = action.payload.status;
        state.run.processed = action.payload.processed;
        state.run.total = action.payload.total;
        state.run.errors = action.payload.errors || [];
      });
  },
});

export const { resetPayrollRun } = payrollSlice.actions;
export default payrollSlice.reducer;