import { api } from './api';

export const processApproval = (requestId, data) => api.post(`/approvals/${requestId}`, data).then(r => r.data.data);
export const getApprovals = (requestId) => api.get(`/approvals/${requestId}`).then(r => r.data.data);
