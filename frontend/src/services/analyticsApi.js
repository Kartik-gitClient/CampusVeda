import { api } from './api';

export const getAnalyticsOverview = () => api.get('/analytics/overview').then(r => r.data.data);
export const getRequestsTrend = () => api.get('/analytics/requests-trend').then(r => r.data.data);
export const getConflictStats = () => api.get('/analytics/conflicts').then(r => r.data.data);
export const getDepartmentUsage = () => api.get('/analytics/department-usage').then(r => r.data.data);
