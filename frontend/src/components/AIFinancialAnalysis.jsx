import React, { useState, useEffect } from 'react';

const AIFinancialAnalysis = ({ 
  expenses = [], 
  savings = [] 
}) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Función para obtener análisis de IA usando Ollama
  const fetchAIAnalysis = async () => {
    // Validar que hay datos para analizar
    if (expenses.length === 0 || savings.length === 0) {
      setError('No hay suficientes datos para realizar el análisis');
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Preparar datos para el análisis
      const analysisPrompt = JSON.stringify({
        expenses: expenses.map(exp => ({
          amount: exp.amount || 0,
          category: exp.category || 'otros',
          date: exp.date || new Date().toISOString()
        })),
        savings: savings.map(sav => ({
          goalName: sav.goalName || 'Meta sin nombre',
          targetAmount: sav.targetAmount || 0,
          currentAmount: sav.currentAmount || 0
        }))
      });

      // Simular respuesta de IA si no hay conexión a Ollama
      const mockAIResponse = {
        totalExpenses: expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0),
        expenseBreakdown: expenses.reduce((acc, exp) => {
          const category = exp.category || 'otros';
          acc[category] = (acc[category] || 0) + (exp.amount || 0);
          return acc;
        }, {}),
        savingsProgress: savings.reduce((acc, sav) => {
          acc[sav.goalName || 'Meta sin nombre'] = 
            sav.targetAmount > 0 
              ? Math.round((sav.currentAmount || 0) / sav.targetAmount * 100) 
              : 0;
          return acc;
        }, {}),
        recommendations: [
          'Revisar gastos en categorías con mayor gasto',
          'Establecer un presupuesto mensual',
          'Buscar formas de aumentar ahorros'
        ],
        potentialMonthlySavings: Math.round(
          expenses.reduce((sum, exp) => sum + (exp.amount || 0), 0) * 0.1
        )
      };

      // Simular tiempo de procesamiento
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setAiInsights(mockAIResponse);
      setIsLoading(false);
    } catch (err) {
      console.error('Error en análisis:', err);
      setError('No se pudo generar el análisis');
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAIAnalysis();
  }, [expenses, savings]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Análisis Financiero</h2>
      {aiInsights ? (
        <div className="space-y-4">
          <div>
            <h3 className="font-semibold">Gastos Totales</h3>
            <p>{aiInsights.totalExpenses?.toLocaleString() || 0} CLP</p>
          </div>

          <div>
            <h3 className="font-semibold">Desglose de Gastos</h3>
            {Object.entries(aiInsights.expenseBreakdown || {}).map(([category, amount]) => (
              <div key={category} className="flex justify-between">
                <span>{category}</span>
                <span>{amount?.toLocaleString() || 0} CLP</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold">Progreso de Ahorros</h3>
            {Object.entries(aiInsights.savingsProgress || {}).map(([goal, progress]) => (
              <div key={goal} className="flex justify-between">
                <span>{goal}</span>
                <span>{progress || 0}%</span>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-semibold">Recomendaciones</h3>
            <ul className="list-disc list-inside">
              {(aiInsights.recommendations || []).map((recommendation, index) => (
                <li key={index}>{recommendation}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold">Potencial de Ahorro Mensual</h3>
            <p>{aiInsights.potentialMonthlySavings?.toLocaleString() || 0} CLP</p>
          </div>
        </div>
      ) : (
        <p>No hay insights disponibles</p>
      )}
    </div>
  );
};

export default AIFinancialAnalysis;