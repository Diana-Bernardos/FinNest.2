import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ExpenseDistribution from './components/ExpenseDistribution';
import ExpenseForm from './components/ExpenseForm';
import { SavingsGoalForm } from './components/SavingsGoalForm';
import AIFinancialAnalysis from './components/AIFinancialAnalysis';

// Servicios mock temporales
const expensesService = {
  create: async (expense) => expense
};

// eslint-disable-next-line no-unused-vars
const savingsService = {
  create: async (saving) => saving
};

// Componentes de los iconos
const Icons = {
  Home: () => <div>🏠</div>,
  Savings: () => <div>💰</div>,
  Expenses: () => <div>💳</div>,
  Analysis: () => <div>📊</div>,
  Settings: () => <div>⚙️</div>,
};

// Componente de Overview
const OverviewPage = ({ expenses = [], savings = [] }) => {
  const totalSavings = useMemo(() =>
    savings.reduce((acc, goal) => 
      acc + parseFloat(goal.currentAmount || goal.current_amount || 0), 0
    ), [savings]
  );

  const monthlyExpenses = useMemo(() => {
    if (!Array.isArray(expenses)) return 0;
    const currentDate = new Date();
    return expenses
      .filter((expense) => {
        try {
          const expenseDate = new Date(expense.date);
          return (
            expenseDate.getMonth() === currentDate.getMonth() &&
            expenseDate.getFullYear() === currentDate.getFullYear()
          );
        } catch {
          return false;
        }
      })
      .reduce((acc, expense) => acc + parseFloat(expense.amount || 0), 0);
  }, [expenses]);

  return (
    <div className="p-4">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white p-3 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium">Gastos Mensuales</h3>
          <p className="text-lg font-bold mt-1">${monthlyExpenses.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium">Total Ahorrado</h3>
          <p className="text-lg font-bold mt-1">${totalSavings.toLocaleString()}</p>
        </div>

        <div className="col-span-3">
          <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white p-3 rounded-lg shadow-sm">
            <h3 className="text-sm font-medium">Metas de Ahorro</h3>
            <p className="text-lg font-bold mt-1">{savings.length} metas activas</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
            {savings.length > 0 ? (
              savings.map((goal) => (
                <div key={goal.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-1">
                    <p className="font-medium text-sm">{goal.goalName || goal.goal_name}</p>
                    <div className="text-xs text-gray-500">
                      Meta: ${(parseFloat(goal.targetAmount || goal.target_amount) || 0).toLocaleString()}
                    </div>
                  </div>
                  
                  <div className="mb-2">
                    <div className="flex justify-between text-sm text-gray-600 mb-1">
                      <span>Progreso</span>
                      <span>
                        {Math.round(((parseFloat(goal.currentAmount || goal.current_amount) || 0) /
                          (parseFloat(goal.targetAmount || goal.target_amount) || 1)) * 100)}%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{
                          width: `${Math.min(
                            Math.round(((parseFloat(goal.currentAmount || goal.current_amount) || 0) /
                              (parseFloat(goal.targetAmount || goal.target_amount) || 1)) * 100),
                            100
                          )}%`
                        }}
                      />
                    </div>
                  </div>
                  
                  <div className="text-sm text-gray-600">
                    Ahorrado: ${(parseFloat(goal.currentAmount || goal.current_amount) || 0).toLocaleString()}
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white p-4 rounded-lg shadow-md text-center text-gray-500">
                No hay metas de ahorro activas.
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Distribución de Gastos</h3>
          <ExpenseDistribution expenses={expenses} />
        </div>
        <div className="bg-white p-3 rounded-lg shadow-sm">
          <h3 className="text-sm font-medium text-gray-700 mb-3">Análisis Financiero</h3>
          <AIFinancialAnalysis expenses={expenses} savings={savings} />
        </div>
      </div>
    </div>
  );
};

// Componente de Configuración
const SettingsPage = () => (
  <div>
    <h2>Configuraciones</h2>
    <p>Preferencias</p>
    <p>Próximamente más configuraciones</p>
  </div>
);

// Componente Principal
const App = () => {
  const [activeSection, setActiveSection] = useState('overview');
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const syncPendingData = useCallback(async () => {
    try {
      const pendingExpenses = expenses.filter(exp => !exp.synced);
      for (const expense of pendingExpenses) {
        try {
          const syncedExpense = await expensesService.create(expense);
          setExpenses(prev =>
            prev.map(exp =>
              exp.id === expense.id ? { ...syncedExpense, synced: true } : exp
            )
          );
        } catch (error) {
          console.error('Error sincronizando gasto:', error);
        }
      }
      localStorage.setItem('expenses', JSON.stringify(expenses));
    } catch (error) {
      console.error('Error en sincronización:', error);
    }
  }, [expenses]);

  const handleAddExpense = useCallback((expenseData) => {
    const newExpense = {
      ...expenseData,
      id: Date.now().toString(),
      synced: false,
    };
    setExpenses(prev => {
      const updatedExpenses = [...prev, newExpense];
      localStorage.setItem('expenses', JSON.stringify(updatedExpenses));
      return updatedExpenses;
    });
    expensesService.create(newExpense).catch(error => {
      console.error('Error guardando gasto en servidor:', error);
    });
  }, []);

  const handleAddSavingsGoal = useCallback(async (goalData) => {
  try {
    // Validación de datos requeridos
    if (!goalData.goalName || !goalData.targetAmount || !goalData.targetDate) {
      throw new Error('Todos los campos son requeridos');
    }

    // Validación y formateo de fecha
    const targetDate = new Date(goalData.targetDate);
    if (isNaN(targetDate.getTime())) {
      throw new Error('La fecha seleccionada no es válida');
    }

    // Validación del monto
    const targetAmount = parseFloat(goalData.targetAmount);
    if (isNaN(targetAmount) || targetAmount <= 0) {
      throw new Error('El monto objetivo debe ser un número positivo');
    }

    const newSavingsGoal = {
      id: Date.now().toString(),
      goalName: goalData.goalName.trim(),
      targetAmount: targetAmount,
      currentAmount: parseFloat(goalData.currentAmount || 0),
      targetDate: targetDate.toISOString().split('T')[0],
      synced: false
    };

    setSavings(prev => {
      const updatedSavings = [...prev, newSavingsGoal];
      localStorage.setItem('savings', JSON.stringify(updatedSavings));
      return updatedSavings;
    });

    return newSavingsGoal;
  } catch (error) {
    console.error('Error agregando meta de ahorro:', error);
    throw error; // Re-lanzamos el error para manejarlo en el componente del formulario
  }
}, []);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const localExpenses = JSON.parse(localStorage.getItem('expenses') || '[]');
        const localSavings = JSON.parse(localStorage.getItem('savings') || '[]');
        setExpenses(localExpenses);
        setSavings(localSavings);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError('Error al cargar datos locales.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const handleOnline = () => {
      const hasPendingData = expenses.some(item => !item.synced);
      if (hasPendingData) {
        syncPendingData();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [expenses, syncPendingData]);

  const sections = useMemo(() => [
    {
      id: 'overview',
      icon: <Icons.Home />,
      title: 'Resumen',
      color: 'bg-gradient-to-r from-blue-500 to-teal-400',
      component: () => <OverviewPage expenses={expenses} savings={savings} />,
    },
    {
      id: 'savings',
      icon: <Icons.Savings />,
      title: 'Ahorros',
      color: 'bg-gradient-to-r from-green-400 to-emerald-500',
      component: () => <SavingsGoalForm onAddGoal={handleAddSavingsGoal} />,
    },
    {
      id: 'expenses',
      icon: <Icons.Expenses />,
      title: 'Gastos',
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      component: () => <ExpenseForm onAddExpense={handleAddExpense} />,
    },
    {
      id: 'analysis',
      icon: <Icons.Analysis />,
      title: 'Análisis',
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      component: () => <AIFinancialAnalysis expenses={expenses} savings={savings} />,
    },
    {
      id: 'settings',
      icon: <Icons.Settings />,
      title: 'Config',
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      component: SettingsPage,
    },
  ], [expenses, savings, handleAddExpense, handleAddSavingsGoal]);

  return (
    <div className="flex h-screen">
      <div className="w-56 bg-gray-800 text-white flex flex-col space-y-2 p-3">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-md focus:outline-none flex items-center ${
              activeSection === section.id
                ? section.color + ' text-white'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            {section.icon}
            <span className="ml-2 text-sm">{section.title}</span>
          </button>
        ))}
      </div>

      <div className="flex-1 p-4">
        {error && <div className="text-red-500">{error}</div>}
        {isLoading ? (
          <div>Cargando...</div>
        ) : (
          sections.find((section) => section.id === activeSection)?.component()
        )}
      </div>
    </div>
  );
};

export default App;