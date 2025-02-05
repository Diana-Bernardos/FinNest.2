/* eslint-disable no-const-assign */
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

// Componente de Overview
const OverviewPage = ({ expenses = [], savings = [] }) => {
  // Estados locales
  const [aiInsights, setAiInsights] = useState(null);

  useEffect(() => {
    // Simular el análisis de la IA con los datos actuales
    const insights = {
      gastosTotales: expenses.reduce((acc, exp) => acc + parseFloat(exp.amount || 0), 0),
      ahorrosTotales: savings.reduce((acc, sav) => acc + parseFloat(sav.current_amount || 0), 0),
      analisisGastos: "Los gastos se distribuyen según las categorías establecidas. Revisa periódicamente para mantener un control efectivo.",
      progresoAhorros: "El progreso de ahorros está alineado con las metas establecidas.",
      recomendaciones: [
        "Mantén un registro detallado de gastos diarios",
        "Establece límites por categoría",
        "Revisa mensualmente tus metas de ahorro"
      ],
      categoriasMayorGasto: [...new Set(expenses.map((exp) => exp.category))],
      potencialAhorro:
        expenses.reduce((acc, exp) => acc + parseFloat(exp.amount || 0), 0) * 0.2,
    };
    setAiInsights(insights);
  }, [expenses, savings]);

  const totalSavings = useMemo(() => {
    return savings.reduce(
      (acc, goal) =>
        acc +
        parseFloat(goal.currentAmount || goal.current_amount || 0),
      0
    );
  }, [savings]);
  

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
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold text-center">Resumen</h2>

      {/* Contenedor principal para las tarjetas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Tarjeta de Gastos Mensuales */}
        <div className="w-full bg-gradient-to-r from-green-400 to-emerald-500 p-4 rounded-lg shadow-md text-white flex flex-col justify-between">
          <p className="font-semibold text-sm">Gastos Mensuales</p>
          <p className="text-2xl font-bold">
            {monthlyExpenses.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </p>
          <span className="text-3xl">💳</span>
        </div>

        {/* Tarjeta de Total Ahorrado */}
        <div className="w-full bg-gradient-to-r from-blue-500 to-teal-400 p-4 rounded-lg shadow-md text-white flex flex-col justify-between">
          <p className="font-semibold text-sm">Total Ahorrado</p>
          <p className="text-2xl font-bold">
            {totalSavings.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </p>
          <span className="text-3xl">💰</span>
        </div>

        {/* Tarjeta de Metas de Ahorro */}
        <div className="w-full bg-gradient-to-r from-purple-500 to-indigo-600 p-4 rounded-lg shadow-md text-white flex flex-col justify-between">
          <p className="font-semibold text-sm">Metas de Ahorro</p>
          <p className="text-2xl font-bold">{savings.length} metas activas</p>
          <span className="text-3xl">🎯</span>
        </div>
      </div>

      {/* Gráfica de Distribución de Gastos */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 w-full bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg shadow-md text-white">
        <h3 className="text-lg font-bold mb-4">Distribución de Gastos</h3>
        <ExpenseDistribution expenses={expenses} />
      </div>

      {/* Análisis Financiero IA */}
      <div className="col-span-1 md:col-span-2 lg:col-span-3 w-full bg-gradient-to-r from-pink-500 to-red-500 p-4 rounded-lg shadow-md text-white">
        <h3 className="text-lg font-bold mb-4">Análisis Financiero</h3>
        {aiInsights && (
          <div>
            <p>Análisis de Gastos: {aiInsights.analisisGastos}</p>
            <p>Progreso de Ahorros: {aiInsights.progresoAhorros}</p>
            <p>Potencial Ahorro: {aiInsights.potencialAhorro.toFixed(2)} EUR</p>
            <p>Categorías con Mayor Gasto: {aiInsights.categoriasMayorGasto.join(", ")}</p>
            <p>Recomendaciones:</p>
            <ul>
              {aiInsights.recomendaciones.map((rec, index) => (
                <li key={index}>{rec}</li>
              ))}
            </ul>
          </div>
        )}
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

  const handleAddExpense = useCallback(async (expenseData) => {
    try {
      const response = await expensesService.create({
        date: expenseData.date,
        amount: parseFloat(expenseData.amount),
        category: expenseData.category,
        description: expenseData.description || '',
      });
      const newExpense = response.expense || response;
      setExpenses((prev) => [...prev, newExpense]);
      return newExpense;
    } catch (error) {
      console.error('Error guardando gasto:', error);
      throw error;
    }
  }, []);

  // Agregar una nueva meta de ahorro
  const handleAddSavingsGoal = useCallback(async (goalData) => {
    try {
      const targetDate = new Date(goalData.targetDate);
      const targetAmount = parseFloat(goalData.targetAmount);
      const currentAmount = parseFloat(goalData.currentAmount || 0);
      const newSavingsGoal = await savingsService.create({
        goal_name: goalData.goalName.trim(),
        target_amount: targetAmount,
        current_amount: currentAmount,
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
  
        console.log("Datos de ahorros obtenidos:", savingsData);
        console.log("Datos de gastos obtenidos:", expensesData);
  
        if (!Array.isArray(expensesData)) {
          console.error("Los datos de gastos no son un array:", expensesData);
          expensesData = [];
        }
  
        const transformedExpenses = expensesData.map((expense) => ({
          id: expense.id,
          date: new Date(expense.date).toISOString().split('T')[0],
          amount: parseFloat(expense.amount),
          category: String(expense.category).trim(),
          description: String(expense.description || '').trim(),
          synced: true,
        }));
  
        setSavings(savingsData || []);
        setExpenses(transformedExpenses || []);
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
        component: () => (
          <SavingsGoalForm onAddSavingsGoal={handleAddSavingsGoal} />
        ),
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
      <nav className="w-64 bg-gradient-to-b from-gray-700 to-gray-900 text-white flex-shrink-0 p-4 space-y-4">
        {sections.map((section) => (
          <button
            key={section.id}
            onClick={() => setActiveSection(section.id)}
            className={`p-2 rounded-lg transition-all duration-200 ease-in-out hover:shadow-md focus:outline-none flex items-center ${
              activeSection === section.id
                ? `${section.color} text-white`
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            <span className="text-2xl mr-2">{section.icon()}</span>
            {section.title}
          </button>
        ))}
      </nav>

      {/* Contenido Principal */}
      <main className="flex-grow p-6 overflow-y-auto">
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