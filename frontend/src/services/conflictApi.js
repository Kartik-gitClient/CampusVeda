import { api } from './api';

export const getConflicts = () => api.get('/conflicts').then(r => r.data.data);
export const resolveConflict = (id, data) => api.patch(`/conflicts/${id}/resolve`, data).then(r => r.data.data);
