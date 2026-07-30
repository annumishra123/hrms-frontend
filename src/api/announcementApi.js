import axiosInstance from "./interceptor";

export const getAnnouncements = async () => {
  const response = await axiosInstance.get('/announcements');
  return response.data;
};

export const createAnnouncement = async (data) => {
  const response = await axiosInstance.post('/announcements', data);
  return response.data;
};

export const deleteAnnouncement = async (id) => {
  const response = await axiosInstance.delete(`/announcements/${id}`);
  return response.data;
};




 