import React, { useState, } from 'react';
import axios from 'axios';

const AIFinancialAnalysis = ({ expenses = [], savings = [] }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAIAnalysis = async () => {
    if (!Array.isArray(expenses) || !Array.isArray(savings)) {
      setError('Los datos de gastos o ahorros no son válidos.');
      return;
    }

    if (expenses.length === 0 && savings.length === 0) {
      setError('No hay suficientes datos para realizar el análisis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiInsights(null);

    try {
      const prompt = `
        Actúa como un analista financiero experto y proporciona un análisis detallado en formato JSON.
        Gastos: ${JSON.stringify(expenses, null, 2)}
        Ahorros: ${JSON.stringify(savings, null, 2)}
        Responde exclusivamente en este formato JSON sin añadir texto antes o después:
        {
          "gastosTotales": número,
          "ahorrosTotales": número,
          "analisisGastos": "string",
          "progresoAhorros": "string",
          "recomendaciones": ["string", "string", "string"],
          "categoriasMayorGasto": ["string", "string", "string"],
          "potencialAhorro": número
        }
      `;

      const response = await axios.post('http://localhost:11434/api/generate', {
        model: 'llama3.2:3b-instruct-q8_0',
        prompt,
        stream: false,
      });

      if (response.status !== 200 || !response.data || !response.data.response) {
        throw new Error('Respuesta inválida de la API.');
      }

      const aiText = response.data.response.trim();
      console.log('Texto bruto del modelo:', aiText);

      // Extraer el JSON válido de la respuesta
      const jsonStartIndex = aiText.indexOf('{');
      const jsonEndIndex = aiText.lastIndexOf('}') + 1;

      if (jsonStartIndex === -1 || jsonEndIndex === 0) {
        throw new Error('No se encontró un JSON válido en la respuesta.');
      }

      const cleanJson = aiText.substring(jsonStartIndex, jsonEndIndex);
      console.log('JSON limpio:', cleanJson);

      const jsonData = JSON.parse(cleanJson);
      setAiInsights(extractRelevantData(jsonData));
    } catch (error) {
      console.error('Error al obtener análisis de la IA:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const extractRelevantData = (jsonData) => ({
    gastosTotales: jsonData.gastosTotales || 0,
    ahorrosTotales: jsonData.ahorrosTotales || 0,
    analisisGastos: jsonData.analisisGastos || 'Sin análisis disponible',
    progresoAhorros: jsonData.progresoAhorros || 'Sin progreso disponible',
    recomendaciones: Array.isArray(jsonData.recomendaciones)
      ? jsonData.recomendaciones
      : ['Sin recomendaciones disponibles'],
    categoriasMayorGasto: Array.isArray(jsonData.categoriasMayorGasto)
      ? jsonData.categoriasMayorGasto
      : ['Sin categorías disponibles'],
    potencialAhorro: jsonData.potencialAhorro || 0,
  });

  return (
    <div className="space-y-4">
      <button
        onClick={fetchAIAnalysis}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
          isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? 'Analizando...' : 'Obtener Análisis'}
      </button>
  
      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}
  
      {aiInsights && (
        <div className="space-y-4">
          <p>
            <strong>Análisis de Gastos:</strong> {aiInsights.analisisGastos}
          </p>
          <p>
            <strong>Progreso de Ahorros:</strong> {aiInsights.progresoAhorros}
          </p>
          <p>
            <strong>Potencial Ahorro:</strong>{' '}
            {aiInsights.potencialAhorro.toLocaleString('es-ES', {
              style: 'currency',
              currency: 'EUR',
            })}
          </p>
          <p>
            <strong>Categorías con Mayor Gasto:</strong>{' '}
            {aiInsights.categoriasMayorGasto.join(', ')}
          </p>
          <p>
            <strong>Recomendaciones:</strong>
            <ul className="list-disc list-inside">
              {aiInsights.recomendaciones.map((rec, index) => (
                <li key={index}>{rec}</li> 
              ))}
            </ul>
          </p>
        </div>
      )}
    </div>
  );
};

export default AIFinancialAnalysis;