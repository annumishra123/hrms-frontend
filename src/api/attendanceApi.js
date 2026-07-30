import axiosInstance from "./interceptor";

export const getAttendanceOverview = async () => {
  const response = await axiosInstance.get('/attendance/overview');
  return response.data;
};

export const getMonthlyAttendance = (month, year) =>
  axiosInstance.get("/attendance/monthly", { params: { month, year } });