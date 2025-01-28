import React, { useState } from 'react';

const SavingsGoalForm = ({ onAddGoal }) => {
  const [goalData, setGoalData] = useState({
    name: '',
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

  const validateForm = () => {
    const newErrors = {};

    if (!goalData.name.trim()) {
      newErrors.name = 'El nombre del objetivo es requerido';
    }

    const targetAmount = parseFloat(goalData.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      newErrors.targetAmount = 'Ingrese un monto válido y mayor a 0';
    }

    const currentAmount = parseFloat(goalData.currentAmount);
    if (isNaN(currentAmount) || currentAmount < 0) {
      newErrors.currentAmount = 'Ingrese un monto válido';
    }

    if (currentAmount > targetAmount) {
      newErrors.currentAmount = 'El monto actual no puede ser mayor al objetivo';
    }

    if (!goalData.targetDate) {
      newErrors.targetDate = 'Seleccione una fecha objetivo';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      const formattedGoal = {
        goalName: goalData.name,
        targetAmount: parseFloat(goalData.targetAmount),
        currentAmount: parseFloat(goalData.currentAmount),
        targetDate: new Date(goalData.targetDate)
      };

      onAddGoal(formattedGoal);

      // Resetear formulario
      setGoalData({
        name: '',
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
          name="name"
          value={goalData.name}
          onChange={handleChange}
          className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : ''}`}
          placeholder="Ej. Vacaciones, Casa, Auto"
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
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

export default SavingsGoalForm;