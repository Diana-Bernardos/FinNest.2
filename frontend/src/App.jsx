import React, { useState, useEffect } from 'react';
import { ExpenseForm } from './components/ExpenseForm';
import SavingsGoalForm from './components/SavingsGoalForm';
import { v4 as uuidv4 } from 'uuid';

import AIFinancialAnalysis from './components/AIFinancialAnalysis';

// Páginas con lógica implementada
const OverviewPage = ({ expenses, savings }) => {
  const totalSavings = savings.reduce((acc, goal) => acc + goal.currentAmount, 0);
  const monthlyExpenses = expenses
    .filter(expense => {
      const expenseDate = new Date(expense.date);
      const currentDate = new Date();
      return expenseDate.getMonth() === currentDate.getMonth() &&
             expenseDate.getFullYear() === currentDate.getFullYear();
    })
    .reduce((acc, expense) => acc + expense.amount, 0);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Resumen Económico</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm opacity-75 mb-2">Ahorros Totales</h3>
          <p className="text-2xl font-bold">${totalSavings.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm opacity-75 mb-2">Gastos Mensuales</h3>
          <p className="text-2xl font-bold">${monthlyExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-lg">
          <h3 className="text-sm opacity-75 mb-2">Metas de Ahorro</h3>
          <p className="text-2xl font-bold">{savings.length} Metas</p>
        </div>
      </div>
    </div>
  );
};

const SavingsPage = ({ savings, onAddGoal }) => {
  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Ahorros</h1>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Nueva Meta de Ahorro</h2>
        <SavingsGoalForm onSaveGoal={onAddGoal} />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Metas Actuales</h2>
        <div className="space-y-4">
          {savings.map((goal) => (
            <div key={goal.id} className="border rounded-lg p-4">
              <h3 className="font-semibold">{goal.goalName}</h3>
              <div className="mt-2">
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Progreso: ${goal.currentAmount} / ${goal.targetAmount}</span>
                  <span>{Math.round((goal.currentAmount / goal.targetAmount) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${Math.min((goal.currentAmount / goal.targetAmount) * 100, 100)}%` }}
                  ></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const ExpensesPage = ({ expenses, onAddExpense }) => {
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (filter === 'all') {
      setFilteredExpenses(expenses);
    } else {
      setFilteredExpenses(expenses.filter(expense => expense.category === filter));
    }
  }, [filter, expenses]);

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Gastos</h1>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Registrar Nuevo Gasto</h2>
        <ExpenseForm onAddExpense={onAddExpense} />
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Historial de Gastos</h2>
        <div className="space-y-4">
          {filteredExpenses.map((expense) => (
            <div key={expense.id} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold">{expense.description || 'Sin descripción'}</h3>
                  <p className="text-sm text-gray-600">
                    Categoría: {expense.category.charAt(0).toUpperCase() + expense.category.slice(1)}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-lg">${expense.amount.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">
                    {new Date(expense.date).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const AnalysisPage = ({ expenses, savings }) => {
  const getCategoryTotals = () => {
    const totals = {};
    expenses.forEach(expense => {
      totals[expense.category] = (totals[expense.category] || 0) + expense.amount;
    });
    return Object.entries(totals).map(([category, total]) => (
      <div key={category} className="flex justify-between items-center">
        <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
        <span className="font-semibold">${total.toLocaleString()}</span>
      </div>
    ));
  };

  const getMonthlyTotals = () => {
    const totals = {};
    expenses.forEach(expense => {
      const date = new Date(expense.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      totals[monthYear] = (totals[monthYear] || 0) + expense.amount;
    });
    return Object.entries(totals).map(([monthYear, total]) => (
      <div key={monthYear} className="flex justify-between items-center">
        <span>{monthYear}</span>
        <span className="font-semibold">${total.toLocaleString()}</span>
      </div>
    ));
  };

  return (
    <div className="space-y-8">
      <h1 className="text-4xl font-bold text-gray-800 mb-6">Análisis Financiero</h1>
      
      {/* Análisis de IA */}
      <AIFinancialAnalysis expenses={expenses} savings={savings} />
      
      {/* Resumen por Categorías */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Gastos por Categoría</h2>
        <div className="space-y-2">
          {getCategoryTotals()}
        </div>
      </div>
      
      {/* Análisis Mensual */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-2xl font-semibold mb-4">Gastos por Mes</h2>
        <div className="space-y-2">
          {getMonthlyTotals()}
        </div>
      </div>
    </div>
  );
};

const SettingsPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Configuraciones</h1>
    <div className="bg-white rounded-2xl shadow-lg p-6">
      <h2 className="text-2xl font-semibold mb-4">Preferencias</h2>
      {/* Aquí puedes agregar configuraciones según necesites */}
    </div>
  </div>
);

// Icons
const Icons = {
  Home: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
    </svg>
  ),
  Savings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7-5v8a2 2 0 002 2h10a2 2 0 002-2v-8a2 2 0 00-2-2H5a2 2 0 00-2 2zm8-2v2h2V8h-2z" />
    </svg>
  ),
  Expenses: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 14l6-6m-5.5.5h.01m4.99 5h.01M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16l3.5-2 3.5 2 3.5-2 3.5 2zM10 8.5a.5.5 0 11-1 0 .5.5 0 011 0zm5 5a.5.5 0 11-1 0 .5.5 0 011 0z" />
    </svg>
  ),
  Analysis: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
    </svg>
  ),
  Settings: () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.947.522 2.11-.274 2.572-1.065z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
  )
};

const App = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expenses, setExpenses] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);

  // Manejadores de eventos
  const handleAddExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      date: new Date(expenseData.date).toISOString()
    };
    setExpenses([...expenses, newExpense]);
  };

  const handleSaveGoal = (newGoal) => {
    const goalWithId = { ...newGoal, id: uuidv4() }; // Add a unique ID
  setSavingsGoals((prevGoals) => [...prevGoals, goalWithId]);
  console.log("Nueva meta de ahorro agregada:", goalWithId);
};

  const sections = [
    { 
      id: 'overview', 
      icon: Icons.Home, 
      title: 'Resumen', 
      color: 'bg-gradient-to-r from-blue-500 to-teal-400',
      component: () => <OverviewPage expenses={expenses} savings={savingsGoals} />
    },
    { 
      id: 'savings', 
      icon: Icons.Savings, 
      title: 'Ahorros', 
      color: 'bg-gradient-to-r from-green-400 to-emerald-500',
      component: () => <SavingsPage savings={savingsGoals} onAddGoal={handleSaveGoal} />
    },
    { 
      id: 'expenses', 
      icon: Icons.Expenses, 
      title: 'Gastos', 
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      component: () => <ExpensesPage expenses={expenses} onAddExpense={handleAddExpense} />
    },
    { 
      id: 'analysis', 
      icon: Icons.Analysis, 
      title: 'Análisis', 
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      component: () => <AnalysisPage expenses={expenses} savings={savingsGoals} />
    },
    { 
      id: 'settings', 
      icon: Icons.Settings, 
      title: 'Config', 
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      component: SettingsPage
    }
  ];

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component || sections[0].component;

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-24 bg-white shadow-lg p-4 flex flex-col space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`
              p-3 rounded-xl transition-all duration-300 ease-in-out transform
              hover:scale-110 hover:shadow-xl focus:outline-none group
              ${activeSection === section.id 
                ? section.color + ' text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            <section.icon className="w-6 h-6 mx-auto" />
            <span className="text-xs block text-center mt-1 opacity-75">
              {section.title}
            </span>
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 overflow-y-auto bg-gray-50">
        <ActiveComponent />
      </div>
    </div>
  );
};

export default App;