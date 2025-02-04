import React, { useState } from 'react';
import axios from 'axios';

const AIFinancialAnalysis = ({ expenses, savings }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAIAnalysis = async () => {
    if (expenses.length === 0 || savings.length === 0) {
      setError('No hay suficientes datos para realizar el análisis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiInsights(null);

    try {
      const response = await axios.post('http://localhost:11434/api/generate', {
        model: "llama3.2:3b-instruct-q8_0",
        prompt: `Actúa como un analista financiero experto y proporciona un análisis en formato JSON.
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
        }`,
        stream: false,
      });

      if (response.status !== 200 || !response.data || !response.data.response) {
        throw new Error('Respuesta inválida de la API.');
      }

      const aiText = response.data.response.trim();
      
      const cleanJson = aiText.replace(/```json|```/g, '').trim();
      const jsonData = JSON.parse(cleanJson);
      
      setAiInsights(extractRelevantData(jsonData));
    } catch (error) {
      console.error("Error al obtener análisis de la IA:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const extractRelevantData = (jsonData) => ({
    gastosTotales: jsonData.gastosTotales || 0,
    ahorrosTotales: jsonData.ahorrosTotales || 0,
    analisisGastos: jsonData.analisisGastos || "Sin análisis disponible",
    progresoAhorros: jsonData.progresoAhorros || "Sin progreso disponible",
    recomendaciones: jsonData.recomendaciones || ["Sin recomendaciones disponibles"],
    categoriasMayorGasto: jsonData.categoriasMayorGasto || ["Sin categorías disponibles"],
    potencialAhorro: jsonData.potencialAhorro || 0
  });

  return (
    <div className="space-y-4">
      <button
        onClick={fetchAIAnalysis}
        disabled={isLoading}
        className={`w-full py-2 px-4 rounded-lg text-white transition-colors ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {isLoading ? "Analizando..." : "Obtener Análisis"}
      </button>

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700">
          {error}
        </div>
      )}

      {aiInsights && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Gastos Totales</p>
              <p className="text-lg font-bold">${aiInsights.gastosTotales.toLocaleString()}</p>
            </div>
            <div className="p-3 bg-green-50 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Ahorros Totales</p>
              <p className="text-lg font-bold">${aiInsights.ahorrosTotales.toLocaleString()}</p>
            </div>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Análisis de Gastos</h4>
            <p className="text-gray-700">{aiInsights.analisisGastos}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Progreso en Ahorros</h4>
            <p className="text-gray-700">{aiInsights.progresoAhorros}</p>
          </div>

          <div className="p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium mb-2">Recomendaciones</h4>
            <ul className="list-disc list-inside space-y-1">
              {aiInsights.recomendaciones.map((item, index) => (
                <li key={index} className="text-gray-700">{item}</li>
              ))}
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Categorías de Mayor Gasto</h4>
              <ul className="list-disc list-inside space-y-1">
                {aiInsights.categoriasMayorGasto.map((item, index) => (
                  <li key={index} className="text-gray-700">{item}</li>
                ))}
              </ul>
            </div>
            <div className="p-4 bg-gray-50 rounded-lg">
              <h4 className="font-medium mb-2">Potencial de Ahorro</h4>
              <p className="text-2xl font-bold text-green-600">
                ${aiInsights.potencialAhorro.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIFinancialAnalysis;