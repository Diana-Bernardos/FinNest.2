import React, { useState } from 'react';
import './styles/tailwind.css';
// Páginas (componentes inline)
const OverviewPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Resumen Económico</h1>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div className="bg-gradient-to-r from-blue-500 to-teal-400 text-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-sm opacity-75 mb-2">Ahorros Totales</h3>
        <p className="text-2xl font-bold">$12,345</p>
      </div>
      <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-sm opacity-75 mb-2">Gastos Mensuales</h3>
        <p className="text-2xl font-bold">$3,210</p>
      </div>
      <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-2xl shadow-lg">
        <h3 className="text-sm opacity-75 mb-2">Metas de Ahorro</h3>
        <p className="text-2xl font-bold">3 Metas</p>
      </div>
    </div>
  </div>
);

const SavingsPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Ahorros</h1>
    <div className="bg-white rounded-2xl shadow-lg p-6">
      Gestión de Ahorros
    </div>
  </div>
);

const ExpensesPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Gastos</h1>
    <div className="bg-white rounded-2xl shadow-lg p-6">
      Registro de Gastos
    </div>
  </div>
);

const AnalysisPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Análisis Financiero</h1>
    <div className="bg-white rounded-2xl shadow-lg p-6">
      Gráficos y Análisis
    </div>
  </div>
);

const SettingsPage = () => (
  <div className="space-y-8">
    <h1 className="text-4xl font-bold text-gray-800 mb-6">Configuraciones</h1>
    <div className="bg-white rounded-2xl shadow-lg p-6">
      Configuración del Sistema
    </div>
  </div>
);

// Icons (inline to avoid external dependencies)
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

  const sections = [
    { 
      id: 'overview', 
      icon: Icons.Home, 
      title: 'Resumen', 
      color: 'bg-gradient-to-r from-blue-500 to-teal-400',
      component: OverviewPage 
    },
    { 
      id: 'savings', 
      icon: Icons.Savings, 
      title: 'Ahorros', 
      color: 'bg-gradient-to-r from-green-400 to-emerald-500',
      component: SavingsPage 
    },
    { 
      id: 'expenses', 
      icon: Icons.Expenses, 
      title: 'Gastos', 
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500',
      component: ExpensesPage 
    },
    { 
      id: 'analysis', 
      icon: Icons.Analysis, 
      title: 'Análisis', 
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600',
      component: AnalysisPage 
    },
    { 
      id: 'settings', 
      icon: Icons.Settings, 
      title: 'Config', 
      color: 'bg-gradient-to-r from-gray-400 to-gray-600',
      component: SettingsPage 
    }
  ];

  const ActiveComponent = sections.find(section => section.id === activeSection)?.component || OverviewPage;

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
              hover:scale-110 hover:shadow-xl focus:outline-none
              ${activeSection === section.id 
                ? section.color + ' text-white' 
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}
            `}
          >
            <section.icon className="w-6 h-6 mx-auto" />
            <span className="text-xs block text-center mt-1 opacity-0 group-hover:opacity-100">
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