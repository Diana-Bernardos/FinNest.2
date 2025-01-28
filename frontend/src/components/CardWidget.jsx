import React from 'react';

export const CardWidget = ({ 
  title, 
  value, 
  change, 
  color, 
  description 
}) => (
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
export default CardWidget;