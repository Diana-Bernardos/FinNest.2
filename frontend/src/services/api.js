// src/services/api.js
import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:4000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Servicios de Ahorros
export const savingsService = {
  // Obtener todos los ahorros
  getAll: async (page = 1, limit = 10) => {
    try {
      const response = await api.get('/savings', { 
        params: { page, limit } 
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo ahorros:', error);
      throw error;
    }
  },

  // Crear nuevo ahorro
  create: async (savingData) => {
    try {
      const response = await api.post('/savings', savingData);
      return response.data;
    } catch (error) {
      console.error('Error creando ahorro:', error);
      throw error;
    }
  },

  // Actualizar ahorro
  update: async (id, updateData) => {
    try {
      const response = await api.put(`/savings/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando ahorro:', error);
      throw error;
    }
  },

  // Eliminar ahorro
  delete: async (id) => {
    try {
      const response = await api.delete(`/savings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando ahorro:', error);
      throw error;
    }
  }
};

// Servicios de Gastos
export const expensesService = {
  // Obtener todos los gastos
  getAll: async (page = 1, limit = 10, filters = {}) => {
    try {
      const response = await api.get('/expenses', { 
        params: { 
          page, 
          limit, 
          ...filters 
        } 
      });
      return response.data;
    } catch (error) {
      console.error('Error obteniendo gastos:', error);
      throw error;
    }
  },

  // Crear nuevo gasto
  create: async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      console.error('Error creando gasto:', error);
      throw error;
    }
  },

  // Actualizar gasto
  update: async (id, updateData) => {
    try {
      const response = await api.put(`/expenses/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando gasto:', error);
      throw error;
    }
  },

  // Eliminar gasto
  delete: async (id) => {
    try {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando gasto:', error);
      throw error;
    }
  }
};

// Servicios de Análisis
export const analysisService = {
  // Obtener resumen mensual
  getMonthlySummary: async () => {
    try {
      const response = await api.get('/analysis/monthly-summary');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo resumen mensual:', error);
      throw error;
    }
  },

  // Obtener análisis por categoría
  getCategoryBreakdown: async () => {
    try {
      const response = await api.get('/expenses/analysis/by-category');
      return response.data;
    } catch (error) {
      console.error('Error obteniendo análisis por categoría:', error);
      throw error;
    }
  }
};

// Utilidades
export const utilService = {
  // Formateo de moneda
  formatCurrency: (amount) => {
    return new Intl.NumberFormat('es-CL', {
      style: 'currency',
      currency: 'CLP'
    }).format(amount);
  }
};

export default api;