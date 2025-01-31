import React, { useState } from 'react';
import { expensesService } from '../services/api';

const VALID_CATEGORIES = [
  'alimentación',
  'transporte',
  'vivienda',
  'servicios',
  'educación',
  'entretenimiento',
  'salud',
  'otros'
];

const isNumeric = (value, min = 0) => {
  const number = parseFloat(value);
  return !isNaN(number) && number >= min;
};

const isDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const ExpenseForm = ({ onAddExpense, onError }) => {
  const [expenseData, setExpenseData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }));
    // Limpiar error del campo cuando cambia
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const validateExpenseForm = () => {
    const newErrors = {};

    if (!isNumeric(expenseData.amount, 0.01)) {
      newErrors.amount = 'El monto debe ser mayor a 0';
    }

    if (!VALID_CATEGORIES.includes(expenseData.category)) {
      newErrors.category = 'Seleccione una categoría válida';
    }

    if (!isDate(expenseData.date)) {
      newErrors.date = 'Fecha inválida';
    } else {
      const selectedDate = new Date(expenseData.date);
      const today = new Date();
      if (selectedDate > today) {
        newErrors.date = 'La fecha no puede ser futura';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateExpenseForm()) {
      setIsSubmitting(true);
      try {
        const expenseToSave = {
          amount: parseFloat(expenseData.amount),
          category: expenseData.category.toLowerCase(),
          description: expenseData.description.trim() || null,
          date: new Date(expenseData.date).toISOString()
        };

        console.log('Enviando gasto:', expenseToSave);
        const response = await expensesService.create(expenseToSave);
        console.log('Respuesta:', response);

        if (onAddExpense) {
          onAddExpense(response.expense);
        }

        // Resetear formulario
        setExpenseData({
          amount: '',
          category: '',
          description: '',
          date: new Date().toISOString().split('T')[0]
        });
        setErrors({});
        
      } catch (error) {
        console.error('Error al crear gasto:', error);
        setErrors(prev => ({
          ...prev,
          submit: error.response?.data?.message || 'Error al guardar el gasto'
        }));
        if (onError) {
          onError(error);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {errors.submit && (
        <div className="bg-red-50 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <span className="block sm:inline">{errors.submit}</span>
        </div>
      )}

      <div>
        <label className="block mb-2 font-medium text-gray-700">Monto</label>
        <input
          type="number"
          name="amount"
          value={expenseData.amount}
          onChange={handleChange}
          step="0.01"
          min="0"
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.amount ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="0.00"
          disabled={isSubmitting}
        />
        {errors.amount && (
          <p className="mt-1 text-sm text-red-600">{errors.amount}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">Categoría</label>
        <select
          name="category"
          value={expenseData.category}
          onChange={handleChange}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="">Seleccionar Categoría</option>
          {VALID_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        {errors.category && (
          <p className="mt-1 text-sm text-red-600">{errors.category}</p>
        )}
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">
          Descripción (Opcional)
        </label>
        <input
          type="text"
          name="description"
          value={expenseData.description}
          onChange={handleChange}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
          placeholder="Detalles del gasto"
          disabled={isSubmitting}
        />
      </div>

      <div>
        <label className="block mb-2 font-medium text-gray-700">Fecha</label>
        <input
          type="date"
          name="date"
          value={expenseData.date}
          onChange={handleChange}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.date ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        />
        {errors.date && (
          <p className="mt-1 text-sm text-red-600">{errors.date}</p>
        )}
      </div>

      <button 
        type="submit"
        disabled={isSubmitting}
        className={`w-full p-3 text-white rounded-lg transition-colors ${
          isSubmitting
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-green-500 hover:bg-green-600'
        }`}
      >
        {isSubmitting ? 'Guardando...' : 'Registrar Gasto'}
      </button>
    </form>
  );
};

export default ExpenseForm;