import axiosInstance from '../api/interceptor';

export const getHolidays = (year) => axiosInstance.get('/holidays', { params: year ? { year } : {} });
export const bulkAddHolidays = (holidays) => axiosInstance.post('/holidays/bulk', { holidays });
export const updateHoliday = (id, data) => axiosInstance.patch(`/holidays/${id}`, data);
export const deleteHoliday = (id) => axiosInstance.delete(`/holidays/${id}`);