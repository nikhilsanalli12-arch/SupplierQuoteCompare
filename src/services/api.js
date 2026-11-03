import axios from 'axios';
import { initialSuppliers, initialQuotations, initialComparisons } from '../data/mockData';

// Environment-driven API Base URL (Render Production + Local Development)
// Resolves safely whether the environment variable provides a root host or a path ending in /api,
// and strictly prevents duplicate /api/api occurrences.
const getResolvedApiBaseUrl = () => {
  const rawUrl = import.meta.env.VITE_API_URL || 
                 import.meta.env.VITE_API_BASE_URL || 
                 (import.meta.env.PROD ? '/api' : 'http://localhost:5000/api');

  if (!rawUrl || typeof rawUrl !== 'string') {
    return '/api';
  }

  const cleanUrl = rawUrl.trim().replace(/\/+$/, '');
  if (cleanUrl.endsWith('/api')) {
    return cleanUrl;
  }
  return `${cleanUrl}/api`;
};

const API_BASE_URL = getResolvedApiBaseUrl();

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const normalizeSupplier = (s) => {
  if (!s || typeof s !== 'object') return s;
  const id = s._id || s.id || '';
  const city = s.city || '';
  const country = s.country || '';
  const location = s.location || (city && country ? `${city}, ${country}` : city || country || 'Unspecified');
  return {
    ...s,
    id,
    _id: s._id || id,
    name: s.name || 'Unnamed Supplier',
    category: s.category || 'General',
    location,
    city,
    country,
    status: s.status || 'Active',
    rating: Number(s.rating || 4.5),
    activeQuotes: Number(s.activeQuotes || 0),
    paymentTerms: s.paymentTerms || 'Net 30'
  };
};

export const normalizeQuotation = (q) => {
  if (!q || typeof q !== 'object') return q;
  const id = q._id || q.id || q.quotationNumber || '';
  const quotationNumber = q.quotationNumber || q.id || id;
  const items = Array.isArray(q.items) ? q.items : [];
  const firstItem = items[0] || {};
  const supplierObj = typeof q.supplierId === 'object' && q.supplierId !== null ? q.supplierId : null;
  const supplierName = q.supplierName || supplierObj?.name || 'Unknown Supplier';
  const category = q.category || firstItem.category || supplierObj?.category || 'General';
  const product = q.product || firstItem.name || q.description || 'General Line Item';
  const quantity = Number(q.quantity ?? firstItem.quantity ?? 1);
  const totalAmount = Number(q.totalAmount ?? q.summary?.grandTotal ?? q.grandTotal ?? 0);
  const unitPrice = Number(q.unitPrice ?? firstItem.unitPrice ?? (quantity > 0 ? totalAmount / quantity : 0));
  const leadTimeDays = Number(q.leadTimeDays ?? q.commercialTerms?.leadTimeDays ?? 7);
  const rawDate = q.quotationDate || q.createdAt || q.date;
  const dateStr = rawDate ? new Date(rawDate).toISOString().split('T')[0] : '';
  const currency = q.summary?.currency || q.currency || 'INR';

  return {
    ...q,
    id,
    _id: q._id || id,
    quotationNumber,
    supplierName,
    category,
    product,
    quantity,
    unitPrice,
    totalAmount,
    grandTotal: totalAmount,
    currency,
    leadTimeDays,
    leadTime: q.leadTime || `${leadTimeDays} days`,
    date: q.date || dateStr,
    quotationDate: rawDate,
    status: q.status || 'Draft',
    items: items.length > 0 ? items : [{
      name: product,
      category,
      quantity,
      unitPrice,
      packageSize: 1,
      measurementUnit: 'pcs',
      lineTotal: totalAmount
    }],
    commercialTerms: q.commercialTerms || {
      leadTimeDays,
      paymentTerms: 'Net 30',
      deliveryCharges: q.shippingCost || 0,
      additionalCharges: 0,
      warrantyMonths: 12
    },
    summary: q.summary || {
      grandTotal: totalAmount,
      grossSubtotal: totalAmount,
      currency
    }
  };
};

export const supplierService = {
  getAll: async (params = {}) => {
    try {
      const res = await apiClient.get('/suppliers', { params });
      const rawData = res.data.data || res.data;
      const list = Array.isArray(rawData) ? rawData : [];
      return list.map(normalizeSupplier);
    } catch (err) {
      console.warn('API error fetching suppliers, using fallback data:', err.message);
      // Fallback filter locally if offline
      let data = initialSuppliers.map(normalizeSupplier);
      if (params.search) {
        const q = params.search.toLowerCase();
        data = data.filter((s) => 
          (s.name || '').toLowerCase().includes(q) || 
          (s.contactPerson || '').toLowerCase().includes(q) ||
          (s.city || '').toLowerCase().includes(q)
        );
      }
      if (params.category && params.category !== 'All') {
        data = data.filter((s) => s.category === params.category);
      }
      if (params.location && params.location !== 'All') {
        data = data.filter((s) => (s.city || s.location || '').toLowerCase().includes(params.location.toLowerCase()));
      }
      return data;
    }
  },

  getById: async (id) => {
    try {
      const res = await apiClient.get(`/suppliers/${id}`);
      const rawData = res.data.data || res.data;
      return normalizeSupplier(rawData);
    } catch (err) {
      console.warn(`API error fetching supplier ${id}:`, err.message);
      const found = initialSuppliers.find((s) => (s._id === id || s.id === id));
      return found ? normalizeSupplier(found) : null;
    }
  },

  create: async (supplierData) => {
    try {
      const res = await apiClient.post('/suppliers', supplierData);
      const rawData = res.data.data || res.data;
      return normalizeSupplier(rawData);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create supplier';
      throw new Error(errorMsg);
    }
  },

  update: async (id, supplierData) => {
    try {
      const res = await apiClient.put(`/suppliers/${id}`, supplierData);
      const rawData = res.data.data || res.data;
      return normalizeSupplier(rawData);
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
      const rawData = res.data.data || res.data;
      const list = Array.isArray(rawData) ? rawData : [];
      return list.map(normalizeQuotation);
    } catch (err) {
      console.warn('API error fetching quotations, using fallback data:', err.message);
      return initialQuotations.map(normalizeQuotation);
    }
  },
  getById: async (id) => {
    try {
      const res = await apiClient.get(`/quotations/${id}`);
      const rawData = res.data.data || res.data;
      return normalizeQuotation(rawData);
    } catch (err) {
      console.warn(`API error fetching quotation ${id}:`, err.message);
      const found = initialQuotations.find((q) => q._id === id || q.id === id);
      return found ? normalizeQuotation(found) : null;
    }
  },
  create: async (quotationData) => {
    try {
      const res = await apiClient.post('/quotations', quotationData);
      const rawData = res.data.data || res.data;
      return normalizeQuotation(rawData);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to create quotation';
      throw new Error(errorMsg);
    }
  },
  update: async (id, quotationData) => {
    try {
      const res = await apiClient.put(`/quotations/${id}`, quotationData);
      const rawData = res.data.data || res.data;
      return normalizeQuotation(rawData);
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to update quotation';
      throw new Error(errorMsg);
    }
  },
  delete: async (id) => {
    try {
      const res = await apiClient.delete(`/quotations/${id}`);
      return res.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to delete quotation';
      throw new Error(errorMsg);
    }
  }
};


export const comparisonService = {
  compare: async (quotationIds) => {
    try {
      const res = await apiClient.post('/quotations/compare', { quotationIds });
      return res.data.data;
    } catch (err) {
      const errorMsg = err.response?.data?.message || err.message || 'Failed to compare quotations';
      throw new Error(errorMsg);
    }
  },
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
