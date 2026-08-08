
// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../api/interceptor";

// export const fetchPayrollOverview = createAsyncThunk(
//   "payroll/fetchOverview",
//   async ({ month, year }) => {
//     const { data } = await api.get("/payroll/overview", { params: { month, year } });
//     return data;
//   }
// );

// export const fetchPayslips = createAsyncThunk(
//   "payroll/fetchPayslips",
//   async ({ page, limit, search, status, month, year }) => {
//     const { data } = await api.get("/payroll/payslips", {
//       params: { page, limit, search, status, month, year },
//     });
//     return data;
//   }
// );

// export const downloadPayslip = createAsyncThunk(
//   "payroll/downloadPayslip",
//   async ({ payslipId, employeeName, month }) => {
//     const response = await api.get(`/payroll/payslips/${payslipId}/pdf`, {
//       responseType: "blob",
//     });
//     const url = window.URL.createObjectURL(new Blob([response.data]));
//     const link = document.createElement("a");
//     link.href = url;
//     link.setAttribute("download", `Payslip-${employeeName}-${month}.pdf`);
//     document.body.appendChild(link);
//     link.click();
//     link.remove();
//     window.URL.revokeObjectURL(url);
//     return payslipId;
//   }
// );

// export const startPayrollRun = createAsyncThunk(
//   "payroll/startRun",
//   async ({ month, year }) => {
//     const { data } = await api.post("/payroll/run", { month, year });
//     return data;
//   }
// );

// export const pollPayrollRunStatus = createAsyncThunk(
//   "payroll/pollRunStatus",
//   async (runId) => {
//     const { data } = await api.get(`/payroll/run/${runId}/status`);
//     return data;
//   }
// );

// const initialState = {
//   summary: null,
//   trend: [],
//   overviewStatus: "idle",

//   payslips: [],
//   totalCount: 0,
//   totalPages: 1,
//   currentPage: 1,
//   payslipsStatus: "idle",

//   downloadingId: null,

//   run: {
//     runId: null,
//     status: "idle",
//     processed: 0,
//     total: 0,
//     errors: [],
//   },
// };

// const payrollSlice = createSlice({
//   name: "payroll",
//   initialState,
//   reducers: {
//     resetPayrollRun(state) {
//       state.run = initialState.run;
//     },
//   },
//   extraReducers: (builder) => {
//     builder
//       .addCase(fetchPayrollOverview.pending, (state) => { state.overviewStatus = "loading"; })
//       .addCase(fetchPayrollOverview.fulfilled, (state, action) => {
//         state.overviewStatus = "succeeded";
//         state.summary = action.payload.summary;
//         state.trend = action.payload.trend;
//       })
//       .addCase(fetchPayrollOverview.rejected, (state) => { state.overviewStatus = "failed"; })

//       .addCase(fetchPayslips.pending, (state) => { state.payslipsStatus = "loading"; })
//       .addCase(fetchPayslips.fulfilled, (state, action) => {
//         state.payslipsStatus = "succeeded";
//         state.payslips = action.payload.payslips;
//         state.totalCount = action.payload.totalCount;
//         state.totalPages = action.payload.totalPages;
//         state.currentPage = action.payload.currentPage;
//       })
//       .addCase(fetchPayslips.rejected, (state) => { state.payslipsStatus = "failed"; })

//       .addCase(downloadPayslip.pending, (state, action) => {
//         state.downloadingId = action.meta.arg.payslipId;
//       })
//       .addCase(downloadPayslip.fulfilled, (state) => { state.downloadingId = null; })
//       .addCase(downloadPayslip.rejected, (state) => { state.downloadingId = null; })

//       .addCase(startPayrollRun.pending, (state) => { state.run.status = "queued"; })
//       .addCase(startPayrollRun.fulfilled, (state, action) => {
//         state.run.runId = action.payload.runId;
//         state.run.status = action.payload.status;
//         state.run.total = action.payload.totalEmployees;
//         state.run.processed = 0;
//       })
//       .addCase(startPayrollRun.rejected, (state) => { state.run.status = "failed"; })
//       .addCase(pollPayrollRunStatus.fulfilled, (state, action) => {
//         state.run.status = action.payload.status;
//         state.run.processed = action.payload.processed;
//         state.run.total = action.payload.total;
//         state.run.errors = action.payload.errors || [];
//       });
//   },
// });

// export const { resetPayrollRun } = payrollSlice.actions;
// export default payrollSlice.reducer;







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

// 700 employees ka payroll ek click me start karne wala thunk
export const startPayrollRun = createAsyncThunk(
  "payroll/startRun",
  async ({ month, year }) => {
    const { data } = await api.post("/payroll/run", { month, year });
    return data; // { runId, status, totalEmployees }
  }
);

// Har 2 sec me progress check karne ke liye poll hota hai
export const pollPayrollRunStatus = createAsyncThunk(
  "payroll/pollRunStatus",
  async (runId) => {
    const { data } = await api.get(`/payroll/run/${runId}/status`);
    return data; // { status, processed, total, errors: [{empId, name, reason}] }
  }
);

// Run complete hone ke baad saare 700 payslips ek ZIP me download
export const downloadAllPayslips = createAsyncThunk(
  "payroll/downloadAllPayslips",
  async ({ runId, month, year }) => {
    const response = await api.get(`/payroll/run/${runId}/download-all`, {
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data], { type: "application/zip" }));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Payslips-${month}-${year}.zip`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
    return runId;
  }
);

// Jo employees fail ho gaye unke liye sirf unhi ko dobara process karo
export const retryFailedRun = createAsyncThunk(
  "payroll/retryFailedRun",
  async (runId) => {
    const { data } = await api.post(`/payroll/run/${runId}/retry`);
    return data; // { runId, status, totalEmployees }
  }
);

// Payroll summary ko Excel/CSV me export karne ke liye
export const exportPayrollSummary = createAsyncThunk(
  "payroll/exportSummary",
  async ({ month, year }) => {
    const response = await api.get("/payroll/export", {
      params: { month, year },
      responseType: "blob",
    });
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `Payroll-Summary-${month}-${year}.xlsx`);
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  }
);

const initialRunState = {
  runId: null,
  status: "idle", // idle | queued | processing | completed | failed
  processed: 0,
  total: 0,
  errors: [],
  downloadingZip: false,
  retrying: false,
};

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
  exporting: false,

  run: initialRunState,
};

const payrollSlice = createSlice({
  name: "payroll",
  initialState,
  reducers: {
    resetPayrollRun(state) {
      state.run = initialRunState;
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

      // --- Run Payroll lifecycle ---
      .addCase(startPayrollRun.pending, (state) => {
        state.run.status = "queued";
        state.run.errors = [];
      })
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
      })

      .addCase(downloadAllPayslips.pending, (state) => { state.run.downloadingZip = true; })
      .addCase(downloadAllPayslips.fulfilled, (state) => { state.run.downloadingZip = false; })
      .addCase(downloadAllPayslips.rejected, (state) => { state.run.downloadingZip = false; })

      .addCase(retryFailedRun.pending, (state) => { state.run.retrying = true; })
      .addCase(retryFailedRun.fulfilled, (state, action) => {
        state.run.retrying = false;
        state.run.status = action.payload.status;
        state.run.runId = action.payload.runId;
      })
      .addCase(retryFailedRun.rejected, (state) => { state.run.retrying = false; })

      .addCase(exportPayrollSummary.pending, (state) => { state.exporting = true; })
      .addCase(exportPayrollSummary.fulfilled, (state) => { state.exporting = false; })
      .addCase(exportPayrollSummary.rejected, (state) => { state.exporting = false; });
  },
});

export const { resetPayrollRun } = payrollSlice.actions;
export default payrollSlice.reducer;