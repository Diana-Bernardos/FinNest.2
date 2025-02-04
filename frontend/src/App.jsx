import React, { useState, useEffect, useMemo, useCallback } from 'react';
import ExpenseDistribution from './components/ExpenseDistribution';
import ExpenseForm from './components/ExpenseForm';
import { SavingsGoalForm } from './components/SavingsGoalForm';
import AIFinancialAnalysis from './components/AIFinancialAnalysis';
import { savingsService, expensesService } from './services/api';

// Componentes de los iconos
const Icons = {
  Home: () => '🏠',
  Savings: () => '💰',
  Expenses: () => '💳',
  Analysis: () => '📊',
  Settings: () => '⚙️',
};

const OverviewPage = ({ expenses = [], savings = [] }) => {
  const totalSavings = useMemo(() => {
    return savings.reduce(
      (acc, goal) =>
        acc +
        parseFloat(goal.currentAmount || goal.current_amount || 0),
      0
    );
  }, [savings]);

  const [monthlyExpenses, setMonthlyExpenses] = useState(0);

useEffect(() => {
  const calculateMonthlyExpenses = () => {
    if (!Array.isArray(expenses)) return 0;
    const currentDate = new Date();
    const filteredExpenses = expenses.filter((expense) => {
      try {
        const expenseDate = new Date(expense.date);
        return (
          expenseDate.getMonth() === currentDate.getMonth() &&
          expenseDate.getFullYear() === currentDate.getFullYear()
        );
      } catch {
        return false;
      }
    });
    const total = filteredExpenses.reduce(
      (acc, expense) => acc + parseFloat(expense.amount || 0),
      0
    );
    setMonthlyExpenses(total);
  };
  calculateMonthlyExpenses();
}, [expenses]);


  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Resumen</h2>

      {/* Tarjeta de Gastos Mensuales */}
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-lg shadow-md text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm">Gastos Mensuales</p>
            <p className="text-2xl font-bold">
              {monthlyExpenses.toLocaleString('es-ES', {
                style: 'currency',
                currency: 'EUR',
              })}
            </p>
          </div>
          <div>
            <span className="text-3xl">💳</span>
          </div>
        </div>
      </div>

        {/* Tarjeta de Total Ahorrado */}
        <div className="w-[300px] bg-gradient-to-r from-blue-500 to-teal-400 p-4 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Total Ahorrado</p>
              <p className="text-2xl font-bold">
                {totalSavings.toLocaleString('es-ES', {
                  style: 'currency',
                  currency: 'EUR',
                })}
              </p>
            </div>
            <div>
              <span className="text-3xl">💰</span>
            </div>
          </div>
        </div>

        {/* Tarjeta de Metas de Ahorro */}
        <div className="w-[300px] bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg shadow-md text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-semibold text-sm">Metas de Ahorro</p>
              <p className="text-2xl font-bold">{savings.length} metas activas</p>
            </div>
            <div>
              <span className="text-3xl">🎯</span>
            </div>
          </div>
          {savings.length > 0 && (
            <ul className="mt-4 space-y-2">
              {savings.map((goal) => (
                <li key={goal.id} className="flex justify-between items-center">
                  <p>{goal.goalName || goal.goal_name}</p>
                  <div className="flex items-center space-x-2">
                    <p>
                      {Math.round(
                        ((parseFloat(goal.currentAmount || goal.current_amount) || 0) /
                          (parseFloat(goal.targetAmount || goal.target_amount) || 1)) *
                          100
                      )}
                      %
                    </p>
                    <div
                      className="w-20 h-2 bg-gray-200 rounded-full"
                      style={{
                        backgroundColor: '#e0e0e0',
                        width: '100%',
                        height: '8px',
                        borderRadius: '20px',
                      }}
                    >
                      <div
                        className="rounded-full h-full"
                        style={{
                          backgroundColor: '#6200ea',
                          width: `${
                            Math.round(
                              ((parseFloat(goal.currentAmount || goal.current_amount) || 0) /
                                (parseFloat(goal.targetAmount || goal.target_amount) || 1)) *
                                100
                            ) || 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Gráfica de Distribución de Gastos */}
        <div className="w-[300px] bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg shadow-md text-white">
          <h3 className="text-lg font-bold mb-4">Distribución de Gastos</h3>
          <ExpenseDistribution />
        </div>

        {/* Análisis Financiero IA */}
        <div className="w-[300px] bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-lg shadow-md text-white">
          <h3 className="text-lg font-bold mb-4">Análisis Financiero</h3>
          <AIFinancialAnalysis expenses={expenses} savings={savings} />
        </div>
      </div>
  
  );
};
// Componente de Configuración
const SettingsPage = () => (
  <div className="p-4 space-y-4">
    <h2 className="text-xl font-bold">Configuraciones</h2>
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

  // Sincronización de datos pendientes
  const syncPendingData = useCallback(async () => {
    try {
      const pendingExpenses = expenses.filter((exp) => !exp.synced);
      for (const expense of pendingExpenses) {
        try {
          const syncedExpense = await expensesService.create(expense);
          setExpenses((prev) =>
            prev.map((exp) =>
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

  // Agregar un nuevo gasto
  const handleAddExpense = useCallback(async (expenseData) => {
    try {
      if (!expenseData.date || !expenseData.amount || !expenseData.category) {
        throw new Error('Todos los campos son requeridos');
      }
      const expenseDate = new Date(expenseData.date);
      if (isNaN(expenseDate.getTime())) {
        throw new Error('La fecha seleccionada no es válida');
      }
      const amount = parseFloat(expenseData.amount);
      if (isNaN(amount) || amount <= 0) {
        throw new Error('El monto debe ser un número positivo');
      }
      const response = await expensesService.create({
        date: expenseDate.toISOString().split('T')[0],
        amount,
        category: expenseData.category.trim(),
        description: expenseData.description?.trim() || '',
      });
      setExpenses((prev) => [...prev, response]);
      return response;
    } catch (error) {
      console.error('Error guardando gasto:', error);
      throw error;
    }
  }, []);

  // Agregar una nueva meta de ahorro
  const handleAddSavingsGoal = useCallback(async (goalData) => {
    try {
      if (!goalData.goalName || !goalData.targetAmount || !goalData.targetDate) {
        throw new Error('Todos los campos son requeridos');
      }

      const targetDate = new Date(goalData.targetDate);
      if (isNaN(targetDate.getTime())) {
        throw new Error('La fecha seleccionada no es válida');
      }

      const targetAmount = parseFloat(goalData.targetAmount);
      if (isNaN(targetAmount) || targetAmount <= 0) {
        throw new Error('El monto objetivo debe ser un número positivo');
      }

      const newSavingsGoal = await savingsService.create({
        goal_name: goalData.goalName.trim(),
        target_amount: targetAmount,
        current_amount: parseFloat(goalData.currentAmount || 0),
        target_date: targetDate.toISOString().split('T')[0],
      });

      setSavings((prev) => [...prev, newSavingsGoal]);
      return newSavingsGoal;
    } catch (error) {
      console.error('Error agregando meta de ahorro:', error);
      throw error;
    }
  }, []);

  // Cargar datos al iniciar la aplicación
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [savingsData, expensesData] = await Promise.all([
          savingsService.getAll(),
          expensesService.getAll(),
        ]);
        setSavings(savingsData || []);
        setExpenses(expensesData || []);
      } catch (error) {
        console.error('Error cargando datos:', error);
        setError(error.response?.data?.message || 'Error al cargar datos del servidor');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  // Detectar cuando el dispositivo está en línea
  useEffect(() => {
    const handleOnline = () => {
      const hasPendingData = expenses.some((item) => !item.synced);
      if (hasPendingData) {
        syncPendingData();
      }
    };
    window.addEventListener('online', handleOnline);
    return () => window.removeEventListener('online', handleOnline);
  }, [expenses, syncPendingData]);

  // Definir las secciones del menú
  const sections = useMemo(
    () => [
      {
        id: 'overview',
        icon: Icons.Home,
        title: 'Resumen',
        color: 'bg-gradient-to-r from-blue-500 to-teal-400',
        component: () => <OverviewPage expenses={expenses} savings={savings} />,
      },
      {
        id: 'savings',
        icon: Icons.Savings,
        title: 'Ahorros',
        color: 'bg-gradient-to-r from-green-400 to-emerald-500',
        component: () => <SavingsGoalForm onAddGoal={handleAddSavingsGoal} />,
      },
      {
        id: 'expenses',
        icon: Icons.Expenses,
        title: 'Gastos',
        color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
        component: () => <ExpenseForm onAddExpense={handleAddExpense} />,
      },
      {
        id: 'analysis',
        icon: Icons.Analysis,
        title: 'Análisis',
        color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
        component: () => <AIFinancialAnalysis expenses={expenses} savings={savings} />,
      },
      {
        id: 'settings',
        icon: Icons.Settings,
        title: 'Configuración',
        color: 'bg-gradient-to-r from-gray-400 to-gray-600',
        component: SettingsPage,
      },
    ],
    [expenses, savings, handleAddExpense, handleAddSavingsGoal]
  );

  return (
    <div className="flex h-screen">
      {/* Menú de Navegación */}
      <nav className="w-64 bg-gray-800 text-white flex-shrink-0">
        <div className="p-4 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-md focus:outline-none flex items-center ${
                activeSection === section.id
                  ? `${section.color} text-white`
                  : 'bg-gray-700 hover:bg-gray-600'
              }`}
            >
              {section.icon()} {section.title}
            </button>
          ))}
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="flex-grow p-6">
        {error && <p className="text-red-500">{error}</p>}
        {isLoading ? (
          <p>Cargando...</p>
        ) : (
          sections.find((section) => section.id === activeSection)?.component()
        )}
      </main>
    </div>
  );
};

export default App;