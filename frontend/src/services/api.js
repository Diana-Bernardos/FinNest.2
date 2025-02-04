// src/services/api.js
import axios from 'axios';

// Configuración base de Axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Servicios de Ahorros
export const savingsService = {
  create: async (savingData) => {
    try {
      // Validar y formatear los datos
      const targetDate = new Date(savingData.target_date);
      if (isNaN(targetDate.getTime())) {
        throw new Error('Fecha inválida');
      }

      const data = {
        goal_name: String(savingData.goal_name).trim(),
        target_amount: Number(savingData.target_amount) || 0,
        current_amount: Number(savingData.current_amount || 0),
        target_date: targetDate.toISOString().split('T')[0],
      };

      console.log('Sending data to server:', data);

      const response = await api.post('/savings', data);
      return response.data;
    } catch (error) {
      console.error('Error creating saving:', {
        originalData: savingData,
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/savings');
      return response.data.savings || [];
    } catch (error) {
      console.error('Error fetching savings:', error);
      return [];
    }
  },
  update: async (id, updateData) => {
    try {
      const transformedData = {
        goal_name: String(updateData.goalName).trim(),
        target_amount: Number(updateData.targetAmount) || 0,
        current_amount: Number(updateData.currentAmount || 0),
        target_date: new Date(updateData.targetDate).toISOString().split('T')[0],
      };
      const response = await api.put(`/savings/${id}`, transformedData);
      return response.data;
    } catch (error) {
      console.error('Error updating saving:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/savings/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting saving:', error);
      throw error;
    }
  },
};

// Servicios de Gastos
export const expensesService = {
  create: async (expenseData) => {
    try {
      const { date, amount, category, description } = expenseData;
      if (!date || !amount || !category) {
        throw new Error('Todos los campos son requeridos');
      }
      const expenseDate = new Date(date);
      if (isNaN(expenseDate.getTime())) {
        throw new Error('La fecha no es válida');
      }
      const data = {
        date: expenseDate.toISOString().split('T')[0],
        amount: parseFloat(amount),
        category: String(category).trim(),
        description: String(description || '').trim(),
      };
      console.log('Sending expense data to server:', data);
      const response = await api.post('/expenses', data);
      return response.data;
    } catch (error) {
      console.error('Error creating expense:', {
        originalData: expenseData,
        error: error.message,
        response: error.response?.data,
      });
      throw error;
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/expenses');
      return Array.isArray(response.data) ? response.data : [];
    } catch (error) {
      console.error('Error obteniendo gastos:', error);
      return [];
    }
  },
  update: async (id, updateData) => {
    try {
      const response = await api.put(`/expenses/${id}`, updateData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando gasto:', error);
      throw error;
    }
  },
  delete: async (id) => {
    try {
      const response = await api.delete(`/expenses/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error eliminando gasto:', error);
      throw error;
    }
  },
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