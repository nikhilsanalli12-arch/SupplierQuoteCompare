import axios from 'axios';
import { initialSuppliers, initialQuotations, initialComparisons } from '../data/mockData';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const supplierService = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/suppliers', { params });
      return res.data.data || res.data;
    } catch (err) {
      console.warn('API error fetching suppliers, using fallback data:', err.message);
      // Fallback filter locally if offline
      let data = [...initialSuppliers];
      if (params.search) {
        const q = params.search.toLowerCase();
        data = data.filter((s) => 
          s.name.toLowerCase().includes(q) || 
          s.contactPerson.toLowerCase().includes(q) ||
          s.city.toLowerCase().includes(q)
        );
      }
      if (params.category && params.category !== 'All') {
        data = data.filter((s) => s.category === params.category);
      }
      if (params.location && params.location !== 'All') {
        data = data.filter((s) => s.city.toLowerCase().includes(params.location.toLowerCase()));
      }
      return data;
    }
  },

  getById: async (id) => {
    try {
      const res = await apiClient.get(`/suppliers/${id}`);
      return res.data.data || res.data;
    } catch (err) {
      console.warn(`API error fetching supplier ${id}:`, err.message);
      return initialSuppliers.find((s) => (s._id === id || s.id === id)) || null;
    }
  },

  create: async (supplierData) => {
    try {
      const res = await apiClient.post('/suppliers', supplierData);
      return res.data.data || res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create supplier';
      throw new Error(errorMsg);
    }
  },

  update: async (id, supplierData) => {
    try {
      const res = await apiClient.put(`/suppliers/${id}`, supplierData);
      return res.data.data || res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update supplier';
      throw new Error(errorMsg);
    }
  },

  delete: async (id, force = false) => {
    try {
      const res = await apiClient.delete(`/suppliers/${id}`, { params: { force } });
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete supplier';
      throw new Error(errorMsg);
    }
  }
};

export const quotationService = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/quotations', { params });
      return res.data.data || res.data;
    } catch {
      return initialQuotations;
    }
  },
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/quotations/${id}`);
      return res.data.data || res.data;
    } catch {
      return initialQuotations.find((q) => q.id === id) || null;
    }
  },
  create: async (quotationData) => {
    try {
      const res = await apiClient.post('/quotations', quotationData);
      return res.data.data || res.data;
    } catch {
      return { id: `QT-${Date.now().toString().slice(-4)}`, ...quotationData };
    }
  },
  update: async (id, quotationData) => {
    try {
      const res = await apiClient.put(`/quotations/${id}`, quotationData);
      return res.data.data || res.data;
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
      return res.data.data || res.data;
    } catch {
      return initialComparisons;
    }
  }
};

export default apiClient;
