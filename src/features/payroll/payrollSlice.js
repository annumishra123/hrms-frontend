import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getPayrollOverview, getPayslips, downloadPayslipPdf } from "../../api/payrollApi";

// ── Overview: stat cards + trend chart
export const fetchPayrollOverview = createAsyncThunk(
  "payroll/fetchOverview",
  async ({ month, year }, { rejectWithValue }) => {
    try {
      const res = await getPayrollOverview(month, year);
      return res.data.data; // backend { success, data: {summary, trend} } bhejta hai maan ke chal rahe hain
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load payroll overview");
    }
  }
);

// ── Payslips: paginated list
export const fetchPayslips = createAsyncThunk(
  "payroll/fetchPayslips",
  async ({ page, limit, search, status, month, year }, { rejectWithValue }) => {
    try {
      const res = await getPayslips({ page, limit, search, status, month, year });
      return res.data.data; // { payslips: [...], totalCount, totalPages, currentPage }
    } catch (err) {
      return rejectWithValue(err?.response?.data?.message || "Failed to load payslips");
    }
  }
);

// ── Download: PDF blob ko trigger karke browser mein save karwata hai
export const downloadPayslip = createAsyncThunk(
  "payroll/downloadPayslip",
  async ({ payslipId, employeeName, month }, { rejectWithValue }) => {
    try {
      const res = await downloadPayslipPdf(payslipId);
      // blob ko ek temporary link bana ke "click" karwa dete hain -> browser download shuru ho jaata hai
      const url = window.URL.createObjectURL(new Blob([res.data], { type: "application/pdf" }));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `Payslip-${employeeName}-${month}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return payslipId;
    } catch (err) {
      return rejectWithValue("Failed to download payslip");
    }
  }
);

const payrollSlice = createSlice({
  name: "payroll",
  initialState: {
    // overview
    summary: null,
    trend: [],
    overviewStatus: "idle",
    overviewError: null,

    // payslips (paginated)
    payslips: [],
    totalCount: 0,
    totalPages: 1,
    currentPage: 1,
    payslipsStatus: "idle",
    payslipsError: null,

    downloadingId: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // overview
      .addCase(fetchPayrollOverview.pending, (state) => {
        state.overviewStatus = "loading";
      })
      .addCase(fetchPayrollOverview.fulfilled, (state, action) => {
        state.overviewStatus = "succeeded";
        state.summary = action.payload.summary;
        state.trend = action.payload.trend;
      })
      .addCase(fetchPayrollOverview.rejected, (state, action) => {
        state.overviewStatus = "failed";
        state.overviewError = action.payload;
      })
      // payslips
      .addCase(fetchPayslips.pending, (state) => {
        state.payslipsStatus = "loading";
      })
      .addCase(fetchPayslips.fulfilled, (state, action) => {
        state.payslipsStatus = "succeeded";
        state.payslips = action.payload.payslips;
        state.totalCount = action.payload.totalCount;
        state.totalPages = action.payload.totalPages;
        state.currentPage = action.payload.currentPage;
      })
      .addCase(fetchPayslips.rejected, (state, action) => {
        state.payslipsStatus = "failed";
        state.payslipsError = action.payload;
      })
      // download
      .addCase(downloadPayslip.pending, (state, action) => {
        state.downloadingId = action.meta.arg.payslipId;
      })
      .addCase(downloadPayslip.fulfilled, (state) => {
        state.downloadingId = null;
      })
      .addCase(downloadPayslip.rejected, (state) => {
        state.downloadingId = null;
      });
  },
});

export default payrollSlice.reducer;