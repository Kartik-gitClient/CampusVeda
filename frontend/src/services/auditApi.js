import { api } from './api';

export const getAuditLogs = () => api.get('/auditlogs').then(r => r.data.data);
