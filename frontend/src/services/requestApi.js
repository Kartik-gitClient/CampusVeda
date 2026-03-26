import { api } from './api';

export const getRequests = () => api.get('/requests').then(r => r.data.data);
export const getRequestById = (id) => api.get(`/requests/${id}`).then(r => r.data.data);
export const createRequest = (data) => api.post('/requests', data).then(r => r.data.data);
export const updateRequest = (id, data) => api.patch(`/requests/${id}`, data).then(r => r.data.data);
export const escalateRequest = (id) => api.post(`/requests/${id}/escalate`).then(r => r.data.data);
export const generateDocument = (data) => api.post('/requests/generate-document', data).then(r => r.data.document);
export const emailDocument = (data) => api.post('/requests/email-document', data).then(r => r.data);
