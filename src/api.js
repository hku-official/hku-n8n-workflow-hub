import axios from 'axios';

const API_BASE = import.meta.env.VITE_N8N_WEBHOOK_BASE || 'https://n8n-its.hku.hk';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

export async function listFlows({ category, search, page = 1, pageSize = 12 } = {}) {
  const params = { page, pageSize };
  if (category) params.category = category;
  if (search) params.search = search;
  const { data } = await api.get('/webhook/n8n-flows', { params });
  return data;
}

export async function getFlow(id) {
  const { data } = await api.get('/webhook/n8n-flow', { params: { id } });
  return data;
}

export async function getCategories() {
  const { data } = await api.get('/webhook/n8n-flows/categories');
  return data;
}

export default api;
