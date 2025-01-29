import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AIFinancialAnalysis = ({ expenses = [], savings = [] }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Configuración de axios
  const api = axios.create({
    baseURL: 'http://localhost:11434',
    headers: {
      'Content-Type': 'application/json'
    }
  });

  const fetchAIAnalysis = async () => {
    if (expenses.length === 0 || savings.length === 0) {
      setError('No hay suficientes datos para realizar el análisis');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const analysisData = {
        expenses: expenses.map(exp => ({
          amount: exp.amount,
          category: exp.category,
          date: exp.date
        })),
        savings: savings.map(sav => ({
          goalName: sav.goalName,
          targetAmount: sav.targetAmount,
          currentAmount: sav.currentAmount
        }))
      };

      const response = await api.post('/api/generate', {
        model: "llama2",
        prompt: `Actúa como un analista financiero experto. Analiza los siguientes datos financieros y proporciona insights detallados y recomendaciones personalizadas:
        
        Datos financieros: ${JSON.stringify(analysisData, null, 2)}
        
        Por favor, proporciona:
        1. Un análisis de los patrones de gasto
        2. Evaluación del progreso hacia las metas de ahorro
        3. Recomendaciones específicas para mejorar la situación financiera
        4. Identificación de áreas de mejora
        5. Sugerencias de ajustes presupuestarios
        
        Estructura tu respuesta en un formato JSON con las siguientes claves:
        {
          "gastosMensuales": número,
          "analisisGastos": string,
          "progresoAhorros": string,
          "recomendaciones": array de strings,
          "areasOptimizacion": array de strings,
          "potencialAhorro": número
        }`
      });

      const aiResponse = JSON.parse(response.data.response);
      setAiInsights(aiResponse);
    } catch (err) {
      console.error('Error en análisis:', err);
      if (err.response) {
        // Error de respuesta del servidor
        setError(`Error del servidor: ${err.response.status}`);
      } else if (err.request) {
        // Error de conexión
        setError('No se pudo conectar con el servidor de IA. Asegúrate de que Ollama esté ejecutándose.');
      } else {
        setError('Error al procesar el análisis');
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (expenses.length > 0 && savings.length > 0) {
      fetchAIAnalysis();
    }
  }, [expenses, savings]);

  if (isLoading) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md">
        <div className="animate-pulse space-y-4">
          <div className="h-4 bg-gray-200 rounded w-3/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button 
          onClick={fetchAIAnalysis}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Reintentar
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Análisis Financiero IA</h2>
      {aiInsights ? (
        <div className="space-y-6">
          <div>
            <h3 className="font-semibold text-lg mb-2">Análisis de Gastos</h3>
            <p className="text-gray-700">{aiInsights.analisisGastos}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Progreso de Ahorros</h3>
            <p className="text-gray-700">{aiInsights.progresoAhorros}</p>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Recomendaciones</h3>
            <ul className="list-disc list-inside space-y-2">
              {aiInsights.recomendaciones?.map((rec, index) => (
                <li key={index} className="text-gray-700">{rec}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Áreas de Optimización</h3>
            <ul className="list-disc list-inside space-y-2">
              {aiInsights.areasOptimizacion?.map((area, index) => (
                <li key={index} className="text-gray-700">{area}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-lg mb-2">Potencial de Ahorro Mensual</h3>
            <p className="text-2xl font-bold text-green-600">
              ${aiInsights.potencialAhorro?.toLocaleString()}
            </p>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">No hay análisis disponible</p>
      )}
    </div>
  );
};

export default AIFinancialAnalysis;