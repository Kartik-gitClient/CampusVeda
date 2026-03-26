import { api } from './api';

export const getResources = (params) => api.get('/resources', { params }).then(r => r.data.data);
export const createResource = (data) => api.post('/resources', data).then(r => r.data.data);
export const updateResource = (id, data) => api.patch(`/resources/${id}`, data).then(r => r.data.data);
export const deleteResource = (id) => api.delete(`/resources/${id}`).then(r => r.data.data);
