import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import _ from 'lodash';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

// Función para validar y normalizar los datos
const validateExpenses = (expenses) => {
  return expenses
    .filter((expense) => !isNaN(expense.amount)) // Filtrar gastos con montos inválidos
    .map((expense) => ({
      ...expense,
      category: expense.category || 'Otros', // Asignar categoría "Otros" si no hay categoría
      amount: parseFloat(expense.amount || 0), // Convertir el monto a número
    }));
};

const ExpenseDistribution = ({ expenses = [] }) => {
  // Validar y procesar los datos
  const validExpenses = useMemo(() => validateExpenses(expenses), [expenses]);
  const chartData = useMemo(() => {
    if (!validExpenses.length) return [];
    const groupedExpenses = _.groupBy(validExpenses, 'category');
    return Object.entries(groupedExpenses).map(([category, items]) => ({
      name: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Otros',
      value: _.sumBy(items, 'amount') || 0,
    }));
  }, [validExpenses]);

  // Calcular el total de gastos
  const totalExpenses = useMemo(() => _.sumBy(chartData, 'value') || 0, [chartData]);

  // Renderizado condicional
  if (!validExpenses.length) {
    return (
      <div className="text-center">
        <h2 className="font-bold">Distribución de Gastos</h2>
        <p className="text-gray-500">No hay gastos registrados.</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-xl font-bold text-center mb-4">Distribución de Gastos</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={60}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            label={({ name, value }) =>
              `${name} (${((value / totalExpenses) * 100).toFixed(1)}%)`
            }
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div className="mt-4">
        <h3 className="font-medium mb-2">Resumen por Categoría</h3>
        <ul className="list-disc list-inside space-y-1">
          {chartData.map((item, index) => (
            <li key={`item-${index}`} className="flex justify-between">
              <span>{item.name}</span>
              <span>${item.value.toLocaleString()}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseDistribution;