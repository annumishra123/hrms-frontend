import axiosInstance from "./interceptor";

export const getPerformanceStats = async (cycle) => {
  const res = await axiosInstance.get("/performance/stats", { params: { cycle } });
  return res.data;
};

export const getReviewCycles = async () => {
  const res = await axiosInstance.get("/performance/cycles");
  return res.data;
};

export const getAllReviews = async ({ cycle, page, limit, search, status }) => {
  const res = await axiosInstance.get("/performance/reviews", {
    params: { cycle, page, limit, search, status },
  });
  return res.data;
};

export const getAllOkrs = async ({ cycle, page, limit, search }) => {
  const res = await axiosInstance.get("/performance/okrs/all", {
    params: { quarter: cycle, page, limit, search },
  });
  return res.data;
};

export const submitReviewRating = async (data) => {
  const res = await axiosInstance.post("/performance/reviews", data);
  return res.data;
};

export const finalizeReview = async (reviewId) => {
  const res = await axiosInstance.patch(`/performance/reviews/${reviewId}/finalize`);
  return res.data;
};

export const createOkrForEmployee = async (data) => {
  const res = await axiosInstance.post("/performance/okrs/admin", data);
  return res.data;
};

export const updateKeyResultProgressAdmin = async (okrId, data) => {
  const res = await axiosInstance.patch(`/performance/okrs/${okrId}/key-result/admin`, data);
  return res.data;
};

export const deleteOkr = async (okrId) => {
  const res = await axiosInstance.delete(`/performance/okrs/${okrId}`);
  return res.data;
};

// Employee picker (Create OKR modal) ke liye — search-as-you-type
export const searchEmployeesLite = async (search) => {
  const res = await axiosInstance.get("/employees", { params: { search, limit: 8 } });
  return res.data;
};