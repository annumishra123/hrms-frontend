import axiosInstance from '../api/interceptor';

export const getAllTickets = (params) => axiosInstance.get('/helpdesk/tickets/all', { params });
export const updateTicketStatus = (id, payload) => axiosInstance.patch(`/helpdesk/tickets/${id}/status`, payload);
export const addTicketComment = (id, text) => axiosInstance.post(`/helpdesk/tickets/${id}/comment`, { text });