import React, { useState } from 'react';

// Definir categorías válidas
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

// Funciones de validación
const isNumeric = (value, min = 0) => {
  const number = parseFloat(value);
  return !isNaN(number) && number >= min;
};

const isDate = (dateString) => {
  const date = new Date(dateString);
  return date instanceof Date && !isNaN(date);
};

export const ExpenseForm = ({ onAddExpense }) => {
  const [expenseData, setExpenseData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setExpenseData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateExpenseForm = () => {
    const newErrors = {};

    // Validar monto
    if (!isNumeric(expenseData.amount, 0.01)) {
      newErrors.amount = 'Monto debe ser un número mayor a 0';
    }

    // Validar categoría
    if (!VALID_CATEGORIES.includes(expenseData.category)) {
      newErrors.category = 'Seleccione una categoría válida';
    }

    // Validar fecha
    if (!isDate(expenseData.date)) {
      newErrors.date = 'Fecha inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateExpenseForm()) {
      onAddExpense({
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        description: expenseData.description,
        date: new Date(expenseData.date)
      });

      // Resetear formulario
      setExpenseData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Monto</label>
        <input
          type="number"
          name="amount"
          value={expenseData.amount}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.amount ? 'border-red-500' : ''}`}
          placeholder="Monto del gasto"
        />
        {errors.amount && <p className="text-red-500 text-sm mt-1">{errors.amount}</p>}
      </div>

      <div>
        <label className="block mb-2">Categoría</label>
        <select
          name="category"
          value={expenseData.category}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.category ? 'border-red-500' : ''}`}
        >
          <option value="">Seleccionar Categoría</option>
          {VALID_CATEGORIES.map(category => (
            <option key={category} value={category}>
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </option>
          ))}
        </select>
        {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category}</p>}
      </div>

      <div>
        <label className="block mb-2">Descripción (Opcional)</label>
        <input
          type="text"
          name="description"
          value={expenseData.description}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          placeholder="Detalles del gasto"
        />
      </div>

      <div>
        <label className="block mb-2">Fecha</label>
        <input
          type="date"
          name="date"
          value={expenseData.date}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.date ? 'border-red-500' : ''}`}
        />
        {errors.date && <p className="text-red-500 text-sm mt-1">{errors.date}</p>}
      </div>

      <button 
        type="submit" 
        className="w-full bg-green-500 text-white p-2 rounded hover:bg-green-600 transition"
      >
        Registrar Gasto
      </button>
    </form>
  );
};