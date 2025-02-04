import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import _ from 'lodash';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

const ExpenseDistribution = ({ expenses = [] }) => {
  const chartData = useMemo(() => {
    if (!expenses?.length) return [];
    const groupedExpenses = _.groupBy(expenses, 'category');
    return Object.entries(groupedExpenses).map(([category, items]) => ({
      name: category ? category.charAt(0).toUpperCase() + category.slice(1) : 'Otros',
      value: _.sumBy(items, 'amount') || 0,
    }));
  }, [expenses]);

  const totalExpenses = useMemo(() => _.sumBy(chartData, 'value') || 0, [chartData]);

  if (!expenses?.length) {
    return (
      <div>
        <h2>Distribución de Gastos</h2>
        <p>No hay gastos registrados.</p>
      </div>
    );
  }

  return (
    <div>
      <h2>Distribución de Gastos</h2>
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
            label={({ name, value }) => `${name} (${((value / totalExpenses) * 100).toFixed(1)}%)`}
          >
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
      <div>
        <h3>Resumen por Categoría</h3>
        <ul>
          {chartData.map((item, index) => (
            <li key={`item-${index}`}>
              {item.name}: ${item.value.toLocaleString()}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ExpenseDistribution;