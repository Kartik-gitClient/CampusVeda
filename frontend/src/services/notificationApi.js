import { api } from './api';

export const getNotifications = () => api.get('/notifications').then(r => r.data.data);
export const markRead = (id) => api.patch(`/notifications/${id}/read`).then(r => r.data.data);
