import React, { useState } from "react";
import { savingsService } from '../services/api';

const SavingsGoalForm = ({ onSaveGoal }) => {
  const [goalData, setGoalData] = useState({
    goalName: "",
    targetAmount: "",
    currentAmount: "",
    targetDate: "",
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setGoalData({ ...goalData, [name]: value });
  };

  const validateForm = () => {
    let newErrors = {};
    const targetAmount = parseFloat(goalData.targetAmount);
    const currentAmount = parseFloat(goalData.currentAmount);

    if (!goalData.goalName) newErrors.goalName = "El nombre del objetivo es obligatorio.";
    if (!goalData.targetAmount) newErrors.targetAmount = "El monto objetivo es obligatorio.";
    if (!goalData.currentAmount) newErrors.currentAmount = "El monto actual es obligatorio.";
    if (!goalData.targetDate) newErrors.targetDate = "La fecha objetivo es obligatoria.";

    if (isNaN(targetAmount) || targetAmount <= 0) {
      newErrors.targetAmount = "El monto objetivo debe ser un número mayor que cero.";
    }

    if (isNaN(currentAmount) || currentAmount < 0) {
      newErrors.currentAmount = "El monto actual debe ser un número mayor o igual a cero.";
    }

    if (!isNaN(targetAmount) && !isNaN(currentAmount) && currentAmount > targetAmount) {
      newErrors.currentAmount = "El monto actual no puede ser mayor que el monto objetivo.";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    if (typeof onSaveGoal === "function") {
      onSaveGoal({
        goalName: goalData.goalName,
        targetAmount: parseFloat(goalData.targetAmount),
        currentAmount: parseFloat(goalData.currentAmount),
        targetDate: goalData.targetDate,
      });
    } else {
      console.error("onSaveGoal no está definido o no es una función.");
    }
  
    setGoalData({ goalName: "", targetAmount: "", currentAmount: "", targetDate: "" });
    setErrors({});
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

export default SavingsGoalForm;