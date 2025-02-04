import React, { useState } from 'react';
import { savingsService } from '../services/api';

export const SavingsGoalForm = ({ onAddGoal }) => {
  const [goalData, setGoalData] = useState({
    goalName: '',
    targetAmount: '',
    currentAmount: '',
    targetDate: ''
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateGoalForm = () => {
    const newErrors = {};

    // Validación del nombre
    if (!goalData.goalName.trim()) {
      newErrors.goalName = 'El nombre del objetivo es requerido';
    }

    // Validación del monto objetivo
    if (!goalData.targetAmount) {
      newErrors.targetAmount = 'El monto objetivo es requerido';
    } else {
      const amount = parseFloat(goalData.targetAmount);
      if (isNaN(amount) || amount <= 0) {
        newErrors.targetAmount = 'El monto objetivo debe ser un número mayor a 0';
      }
    }

    // Validación del monto actual
    if (goalData.currentAmount) {
      const currentAmount = parseFloat(goalData.currentAmount);
      const targetAmount = parseFloat(goalData.targetAmount);
    
      if (isNaN(currentAmount) || currentAmount < 0) {
        newErrors.currentAmount = 'El monto actual debe ser un número positivo';
      } else if (!isNaN(targetAmount) && currentAmount > targetAmount) {
        newErrors.currentAmount = 'El monto actual no puede ser mayor al objetivo';
      }
    }

    // Validación de la fecha
    if (!goalData.targetDate) {
      newErrors.targetDate = 'La fecha objetivo es requerida';
    } else {
      const selectedDate = new Date(goalData.targetDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate <= today) {
        newErrors.targetDate = 'La fecha objetivo debe ser posterior a hoy';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
  
    try {
      if (validateGoalForm()) {
        // Validar y formatear la fecha
        const targetDate = new Date(goalData.targetDate);
        if (isNaN(targetDate.getTime())) {
          throw new Error('Fecha inválida');
        }
  
        const savingData = {
          goal_name: goalData.goalName.trim(),
          target_amount: parseFloat(goalData.targetAmount),
          current_amount: parseFloat(goalData.currentAmount || '0'),
          target_date: targetDate.toISOString().split('T')[0] // Solo la fecha
        };
  
        console.log('Sending data:', savingData);
  
        const newSaving = await savingsService.create(savingData);
        
        // Actualizar localStorage con el formato correcto
        const savedGoals = JSON.parse(localStorage.getItem('savings') || '[]');
        savedGoals.push({
          ...newSaving,
          synced: true,
          target_date: targetDate.toISOString().split('T')[0]
        });
        localStorage.setItem('savings', JSON.stringify(savedGoals));
        
        onAddGoal(newSaving);
        
        // Resetear formulario
        setGoalData({
          goalName: '',
          targetAmount: '',
          currentAmount: '',
          targetDate: ''
        });
        
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(error.response?.data?.error || error.message || 'Error al crear la meta de ahorro');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">
        Nueva Meta de Ahorro
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Objetivo
          </label>
          <input
            type="text"
            name="goalName"
            value={goalData.goalName}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.goalName ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Ej: Vacaciones, Casa, Auto"
            disabled={isSubmitting}
          />
          {errors.goalName && (
            <p className="mt-1 text-sm text-red-600">{errors.goalName}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto Objetivo
          </label>
          <input
            type="number"
            name="targetAmount"
            value={goalData.targetAmount}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.targetAmount ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Monto total a ahorrar"
            min="0"
            step="1000"
            disabled={isSubmitting}
          />
          {errors.targetAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.targetAmount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Monto Actual Ahorrado
          </label>
          <input
            type="number"
            name="currentAmount"
            value={goalData.currentAmount}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.currentAmount ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            placeholder="Monto ya ahorrado (opcional)"
            min="0"
            step="1000"
            disabled={isSubmitting}
          />
          {errors.currentAmount && (
            <p className="mt-1 text-sm text-red-600">{errors.currentAmount}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha Objetivo
          </label>
          <input
            type="date"
            name="targetDate"
            value={goalData.targetDate}
            onChange={handleChange}
            className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              errors.targetDate ? 'border-red-500 bg-red-50' : 'border-gray-300'
            }`}
            disabled={isSubmitting}
          />
          {errors.targetDate && (
            <p className="mt-1 text-sm text-red-600">{errors.targetDate}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`w-full py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white
            ${isSubmitting 
              ? 'bg-blue-400 cursor-not-allowed' 
              : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
            }`}
        >
          {isSubmitting ? 'Guardando...' : 'Crear Meta de Ahorro'}
        </button>
      </form>
    </div>
  );
};

export default SavingsGoalForm;