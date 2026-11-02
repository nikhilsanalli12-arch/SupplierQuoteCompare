import axios from 'axios';
import { initialSuppliers, initialQuotations, initialComparisons } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Helper to determine if we should fall back to local mock data (e.g. when backend is offline)
let backendAvailable = false;

// Attempt a health check or fallback to mock data
export const checkBackendHealth = async () => {
  try {
    const res = await apiClient.get('/health');
    backendAvailable = res.status === 200;
    return backendAvailable;
  } catch {
    backendAvailable = false;
    return false;
  }
};

export const supplierService = {
  getAll: async () => {
    try {
      const res = await apiClient.get('/suppliers');
      return res.data;
    } catch {
      return initialSuppliers;
    }
  },
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/suppliers/${id}`);
      return res.data;
    } catch {
      return initialSuppliers.find((s) => s.id === id) || null;
    }
  },
  create: async (supplierData) => {
    try {
      const res = await apiClient.post('/suppliers', supplierData);
      return res.data;
    } catch {
      return { id: `SUP-${Date.now().toString().slice(-4)}`, ...supplierData };
    }
  },
  update: async (id, supplierData) => {
    try {
      const res = await apiClient.put(`/suppliers/${id}`, supplierData);
      return res.data;
    } catch {
      return { id, ...supplierData };
    }
  },
  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/suppliers/${id}`);
      return res.data;
    } catch {
      return { success: true, message: `Supplier ${id} removed` };
    }
  }
};

export const quotationService = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/quotations', { params });
      return res.data;
    } catch {
      return initialQuotations;
    }
  },
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/quotations/${id}`);
      return res.data;
    } catch {
      return initialQuotations.find((q) => q.id === id) || null;
    }
  },
  create: async (quotationData) => {
    try {
      const res = await apiClient.post('/quotations', quotationData);
      return res.data;
    } catch {
      return { id: `QT-${Date.now().toString().slice(-4)}`, ...quotationData };
    }
  },
  update: async (id, quotationData) => {
    try {
      const res = await apiClient.put(`/quotations/${id}`, quotationData);
      return res.data;
    } catch {
      return { id, ...quotationData };
    }
  },
  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/quotations/${id}`);
      return res.data;
    } catch {
      return { success: true, message: `Quotation ${id} deleted` };
    }
  }
};

export const comparisonService = {
  getComparisons: async () => {
    try {
      const res = await apiClient.get('/comparisons');
      return res.data;
    } catch {
      return initialComparisons;
    }
  }
};

export default apiClient;
