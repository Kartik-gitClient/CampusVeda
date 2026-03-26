import { api } from './api';

export const getPremise = () => api.get('/premise').then(r => r.data.data);
export const updatePremise = (data) => api.post('/premise', data).then(r => r.data);
