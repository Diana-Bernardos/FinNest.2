import React, { useState } from 'react';

// Utilidad de validación
const validateForm = {
  isCurrency: (value) => {
    const currencyRegex = /^\$?(\d{1,3}(,\d{3})*(\.\d{2})?|\d+(\.\d{2})?)$/;
    return currencyRegex.test(value);
  },
  isNumeric: (value, min = null, max = null) => {
    const num = parseFloat(value);
    if (isNaN(num)) return false;
    
    if (min !== null && num < min) return false;
    if (max !== null && num > max) return false;
    
    return true;
  },
  isDate: (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  }
};

// Categorías válidas
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

// Formulario de Ahorros
export const SavingsGoalForm = ({ onAddGoal }) => {
  const [goalData, setGoalData] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const validateGoalForm = () => {
    const newErrors = {};

    // Validar nombre del objetivo
    if (!goalData.goalName.trim()) {
      newErrors.goalName = 'Nombre del objetivo es requerido';
    }

    // Validar monto objetivo
    const targetAmount = parseFloat(goalData.targetAmount);
    if (!validateForm.isNumeric(targetAmount, 1)) {
      newErrors.targetAmount = 'Monto objetivo debe ser un número mayor a 0';
    }

    // Validar monto actual
    const currentAmount = parseFloat(goalData.currentAmount);
    if (!validateForm.isNumeric(currentAmount, 0)) {
      newErrors.currentAmount = 'Monto actual debe ser un número mayor o igual a 0';
    }

    if (currentAmount > targetAmount) {
      newErrors.currentAmount = 'Monto actual no puede ser mayor al monto objetivo';
    }

    // Validar fecha
    if (!validateForm.isDate(goalData.targetDate)) {
      newErrors.targetDate = 'Fecha objetivo inválida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateGoalForm()) {
      onAddGoal({
        goalName: goalData.goalName,
        targetAmount: parseFloat(goalData.targetAmount),
        currentAmount: parseFloat(goalData.currentAmount),
        targetDate: new Date(goalData.targetDate)
      });

      // Resetear formulario
      setGoalData({
        goalName: '',
        targetAmount: '',
        currentAmount: '',
        targetDate: ''
      });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block mb-2">Nombre del Objetivo</label>
        <input
          type="text"
          name="goalName"
          value={goalData.goalName}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.goalName ? 'border-red-500' : ''}`}
          placeholder="Ej. Vacaciones, Casa, Auto"
        />
        {errors.goalName && <p className="text-red-500 text-sm mt-1">{errors.goalName}</p>}
      </div>

      <div>
        <label className="block mb-2">Monto Objetivo</label>
        <input
          type="number"
          name="targetAmount"
          value={goalData.targetAmount}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.targetAmount ? 'border-red-500' : ''}`}
          placeholder="Monto total a ahorrar"
        />
        {errors.targetAmount && <p className="text-red-500 text-sm mt-1">{errors.targetAmount}</p>}
      </div>

      <div>
        <label className="block mb-2">Monto Actual</label>
        <input
          type="number"
          name="currentAmount"
          value={goalData.currentAmount}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.currentAmount ? 'border-red-500' : ''}`}
          placeholder="Monto ya ahorrado"
        />
        {errors.currentAmount && <p className="text-red-500 text-sm mt-1">{errors.currentAmount}</p>}
      </div>

      <div>
        <label className="block mb-2">Fecha Objetivo</label>
        <input
          type="date"
          name="targetDate"
          value={goalData.targetDate}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.targetDate ? 'border-red-500' : ''}`}
        />
        {errors.targetDate && <p className="text-red-500 text-sm mt-1">{errors.targetDate}</p>}
      </div>

      <button 
        type="submit" 
        className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600 transition"
      >
        Crear Meta de Ahorro
      </button>
    </form>
  );
};