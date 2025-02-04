// src/services/api.js
import axios from 'axios';

// Configuración base de axios
const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:3001/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Servicios de Ahorros
export const savingsService = {
  create: async (savingData) => {
    try {
      // Asegurarse de que la fecha sea válida antes de convertirla
      const targetDate = new Date(savingData.target_date);
      if (isNaN(targetDate.getTime())) {
        throw new Error('Fecha inválida');
      }
      const data = {
        goal_name: String(savingData.goal_name).trim(),
        target_amount: Number(savingData.target_amount),
        current_amount: Number(savingData.current_amount || 0),
        target_date: targetDate.toISOString().split('T')[0] // Solo la fecha, sin hora
      };
      console.log('Sending data to server:', data);
      const response = await api.post('/savings', data);
      return response.data;
    } catch (error) {
      console.error('Error creating saving:', {
        originalData: savingData,
        error: error.message,
        response: error.response?.data
      });
      throw error;
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/savings');
      // Asegurar que siempre devolvemos un array
      return response.data.savings || [];
    } catch (error) {
      console.error('Error fetching savings:', error);
      return []; // Retornar array vacío en caso de error
    }
  }, // Coma aquí
  update: async (id, updateData) => {
    try {
      // Transform update data to match backend expectations
      const transformedData = {
        goalName: updateData.goalName,
        targetAmount: updateData.targetAmount,
        currentAmount: updateData.currentAmount,
        targetDate: updateData.targetDate
      };
      const response = await api.put(`/savings/${id}`, transformedData);
      return response.data;
    } catch (error) {
      console.error('Error actualizando ahorro:', error);
      throw error;
    }
  }, // Coma aquí
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
  create: async (expenseData) => {
    try {
      const response = await api.post('/expenses', expenseData);
      return response.data;
    } catch (error) {
      console.error('Error creando gasto:', error);
      throw error;
    }
  },
  getAll: async () => {
    try {
      const response = await api.get('/expenses');
      return Array.isArray(response.data) ? response.data : []; // Garantizar que siempre sea un array
    } catch (error) {
      console.error('Error obteniendo gastos:', error);
      return []; // Retornar array vacío en caso de error
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