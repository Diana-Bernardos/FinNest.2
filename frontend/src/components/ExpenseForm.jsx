import React, { useState } from 'react';

const VALID_CATEGORIES = [
  'alimentacion',
  'transporte',
  'vivienda',
  'servicios',
  'entretenimiento',
  'salud',
  'otros'
];

const ExpenseForm = ({ onAddExpense }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState({});
  const [formData, setFormData] = useState({
    amount: '',
    category: '',
    description: '',
    date: new Date().toISOString().split('T')[0]
  });

  const validateForm = () => {
    const newErrors = {};

    if (!formData.amount || isNaN(Number(formData.amount)) || Number(formData.amount) <= 0) {
      newErrors.amount = 'Ingrese un monto válido mayor a 0';
    }

    if (!formData.category || !VALID_CATEGORIES.includes(formData.category)) {
      newErrors.category = 'Seleccione una categoría válida';
    }

    if (!formData.date || isNaN(new Date(formData.date).getTime())) {
      newErrors.date = 'Ingrese una fecha válida';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onAddExpense({
        ...formData,
        amount: Number(formData.amount)
      });
      
      setFormData({
        amount: '',
        category: '',
        description: '',
        date: new Date().toISOString().split('T')[0]
      });
      setErrors({});
    } catch (error) {
      setErrors(prev => ({ 
        ...prev, 
        submit: 'Error al guardar el gasto. Intente nuevamente.' 
      }));
    } finally {
      setIsSubmitting(false);
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
          value={formData.amount}
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
          value={formData.category}
          onChange={handleChange}
          className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${
            errors.category ? 'border-red-500' : 'border-gray-300'
          }`}
          disabled={isSubmitting}
        >
          <option value="">Seleccionar Categoría</option>
          {VALID_CATEGORIES.map((category) => (
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
          value={formData.description}
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
          value={formData.date}
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