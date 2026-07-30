import axiosInstance from "./interceptor";

// Get team leave requests
export const getLeaveRequests = async () => {
  const response = await axiosInstance.get(
    `/leaves/all`
  );

  return response.data;
};


// Approve / Reject
export const updateLeaveStatus = async (
  id,
  action,
  comment = ""
) => {
  const response = await axiosInstance.patch(
    `/leaves/${id}/action`,
    {
      action,
      comment,
    }
  );

  return response.data;
};





// My Leaves
export const getMyLeaves = async (status = "") => {
  const url = status
    ? `/leaves/my?status=${status}`
    : "/leaves/my";

  const response = await axiosInstance.get(url);

  return response.data;
};


// Cancel Leave
export const cancelLeave = async (id) => {
  const response = await axiosInstance.put(
    `/leaves/cancel/${id}`
  );

  return response.data;
};


// Leave Calendar
export const getLeaveCalendar = async (
  month,
  year
) => {
  const response = await axiosInstance.get(
    `/leaves/calendar?month=${month}&year=${year}`
  );

  return response.data;
};