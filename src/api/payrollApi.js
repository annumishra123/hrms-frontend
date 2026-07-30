import axiosInstance from "../api/interceptor";

export const getPayrollOverview = (month, year) =>
  axiosInstance.get("/payroll/overview", { params: { month, year } });

// 500 employees -> pagination + search + status filter 
export const getPayslips = ({ page = 1, limit = 25, search = "", status = "", month, year }) =>
  axiosInstance.get("/payroll/payslips", {
    params: { page, limit, search, status, month, year },
  });

// PDF blob download - specific employee ke payslip ka
export const downloadPayslipPdf = (payslipId) =>
  axiosInstance.get(`/payroll/payslip/${payslipId}/download`, {
    responseType: "blob", // zaroori hai PDF binary data ke liye
  });