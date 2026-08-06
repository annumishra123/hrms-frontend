import api from "../api/interceptor";

export const submitRegularizeRequest = (payload) => api.post("/regularize", payload);
export const getMyRegularizeRequests = () => api.get("/regularize/me");
export const getAllRegularizeRequests = () =>
  api.get("/regularize");
export const getRegularizeRequestById = (id) => api.get(`/regularize/${id}`);
export const approveRegularizeRequest = (id, managerComment) =>
  api.patch(`/regularize/${id}/approve`, { managerComment });
export const rejectRegularizeRequest = (id, managerComment) =>
  api.patch(`/regularize/${id}/reject`, { managerComment });