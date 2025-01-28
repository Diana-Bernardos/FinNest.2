import React from 'react';
import { Icons } from './Icons';

export const Sidebar = ({ 
  activeSection, 
  onSectionChange 
}) => {
  const sections = [
    { 
      id: 'overview', 
      icon: Icons.Home, 
      title: 'Resumen', 
      color: 'bg-gradient-to-r from-blue-500 to-teal-400' 
    },
    { 
      id: 'savings', 
      icon: Icons.PiggyBank, 
      title: 'Ahorros', 
      color: 'bg-gradient-to-r from-green-400 to-emerald-500' 
    },
    { 
      id: 'expenses', 
      icon: Icons.List, 
      title: 'Gastos', 
      color: 'bg-gradient-to-r from-yellow-400 to-orange-500' 
    },
    { 
      id: 'analysis', 
      icon: Icons.Chart, 
      title: 'Análisis', 
      color: 'bg-gradient-to-r from-purple-500 to-indigo-600' 
    },
    { 
      id: 'settings', 
      icon: Icons.Cog, 
      title: 'Config', 
      color: 'bg-gradient-to-r from-gray-400 to-gray-600' 
    }
  ];

  return (
    <div className="w-24 bg-white shadow-lg p-4 flex flex-col space-y-4">
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => onSectionChange(section.id)}
          className={`
            p-3 rounded-xl transition-all duration-300 ease-in-out transform
            hover:scale-110 hover:shadow-xl focus:outline-none
            ${activeSection === section.id 
              ? `${section.color} text-white` 
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
  );
};

export default Sidebar;