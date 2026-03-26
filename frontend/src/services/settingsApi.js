import { api } from './api';

export const getSettings = () => api.get('/settings').then(r => r.data.data);
export const updateSettings = (data) => api.patch('/settings', data).then(r => r.data.data);
