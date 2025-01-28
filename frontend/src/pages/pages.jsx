import React, { useState, useEffect } from 'react';
import '@fontsource/inter';
import '../styles/tailwind.css';


// Utility Functions
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP'
  }).format(amount);
};

// Mock Service Functions
const mockServices = {
  getSavings: async () => [
    { 
      id: '1', 
      goalName: 'Vacaciones', 
      targetAmount: 500000, 
      currentAmount: 250000, 
      targetDate: '2024-12-31' 
    },
    { 
      id: '2', 
      goalName: 'Emergencia', 
      targetAmount: 1000000, 
      currentAmount: 500000, 
      targetDate: '2024-06-30' 
    }
  ],
  getExpenses: async () => [
    { 
      id: '1', 
      amount: 50000, 
      category: 'Alimentación', 
      description: 'Compra supermercado', 
      date: '2024-02-15' 
    },
    { 
      id: '2', 
      amount: 30000, 
      category: 'Transporte', 
      description: 'Bencina', 
      date: '2024-02-20' 
    }
  ],
  getAnalysisSummary: async () => ({
    monthlyExpenses: 500000,
    monthlySavings: 250000,
    categoryBreakdown: [
      { category: 'Alimentación', totalAmount: 200000, transactionCount: 5 },
      { category: 'Transporte', totalAmount: 150000, transactionCount: 3 }
    ]
  })
};

// Reusable Card Widget
const CardWidget = ({ title, value, change, color, description }) => (
  <div className={`
    p-6 rounded-2xl shadow-md transition-all duration-300 
    hover:shadow-xl transform hover:-translate-y-2
    ${color} text-white
  `}>
    <div className="flex justify-between items-center">
      <div>
        <h3 className="text-sm opacity-75 mb-2">{title}</h3>
        <p className="text-2xl font-bold">{value}</p>
        {description && <p className="text-xs mt-2 opacity-75">{description}</p>}
      </div>
      <span className={`
        px-3 py-1 rounded-full text-sm font-semibold
        ${change.startsWith('+') ? 'bg-green-500/50' : 'bg-red-500/50'}
      `}>
        {change}
      </span>
    </div>
  </div>
);

// Overview Page
export const OverviewPage = () => {
  const [summary, setSummary] = useState({
    savings: [],
    expenses: [],
    analysis: null
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [savingsData, expensesData, analysisData] = await Promise.all([
          mockServices.getSavings(),
          mockServices.getExpenses(),
          mockServices.getAnalysisSummary()
        ]);

        setSummary({
          savings: savingsData,
          expenses: expensesData,
          analysis: analysisData
        });
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Resumen Económico</h1>
      
      {summary.analysis && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <CardWidget 
            title="Ahorros Totales" 
            value={formatCurrency(summary.analysis.monthlySavings)} 
            change="+3.2%" 
            color="bg-gradient-to-r from-blue-500 to-teal-400"
          />
          <CardWidget 
            title="Gastos Mensuales" 
            value={formatCurrency(summary.analysis.monthlyExpenses)} 
            change="-1.5%" 
            color="bg-gradient-to-r from-yellow-400 to-orange-500"
          />
          <CardWidget 
            title="Metas de Ahorro" 
            value={`${summary.savings.length}`} 
            change="+2" 
            color="bg-gradient-to-r from-green-400 to-emerald-500"
          />
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Metas de Ahorro</h2>
          {summary.savings.map(saving => (
            <div 
              key={saving.id} 
              className="mb-4 pb-4 border-b last:border-b-0"
            >
              <div className="flex justify-between">
                <span>{saving.goalName}</span>
                <span className="font-bold">
                  {formatCurrency(saving.currentAmount)} / 
                  {formatCurrency(saving.targetAmount)}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
                <div 
                  className="bg-green-500 h-2.5 rounded-full" 
                  style={{
                    width: `${(saving.currentAmount / saving.targetAmount * 100).toFixed(2)}%`
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold mb-4">Gastos Recientes</h2>
          {summary.expenses.map(expense => (
            <div 
              key={expense.id} 
              className="flex justify-between items-center mb-4 pb-4 border-b last:border-b-0"
            >
              <div>
                <span className="font-semibold">{expense.category}</span>
                <p className="text-sm text-gray-600">{expense.description}</p>
              </div>
              <div className="text-right">
                <span className="font-bold text-red-600">
                  {formatCurrency(expense.amount)}
                </span>
                <p className="text-sm text-gray-600">
                  {new Date(expense.date).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Placeholder pages
export const SavingsPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Ahorros</h1>
    <p>Contenido de la página de Ahorros</p>
  </div>
);

export const ExpensesPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Gastos</h1>
    <p>Contenido de la página de Gastos</p>
  </div>
);

export const AnalysisPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Análisis</h1>
    <p>Contenido de la página de Análisis</p>
  </div>
);

export const SettingsPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Configuraciones</h1>
    <p>Contenido de la página de Configuraciones</p>
  </div>
);