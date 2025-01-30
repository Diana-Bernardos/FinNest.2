import React, { useState } from 'react';
import axios from 'axios';

const AIFinancialAnalysis = ({ expenses, savings }) => {
  const [aiInsights, setAiInsights] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rawResponse, setRawResponse] = useState(null); // Para depuración

  const fetchAIAnalysis = async () => {
    if (expenses.length === 0 || savings.length === 0) {
      setError('No hay suficientes datos para realizar el análisis.');
      return;
    }

    setIsLoading(true);
    setError(null);
    setAiInsights(null);
    setRawResponse(null);

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
      console.log("Respuesta de la IA:", aiText);
      setRawResponse(aiText);

      try {
        // Eliminar los delimitadores Markdown de la respuesta
        const cleanJson = aiText
          .replace(/```json|```/g, '') // Eliminar las etiquetas de código Markdown
          .trim(); // Eliminar espacios y saltos innecesarios

        // Verificar si el JSON está completo y corregirlo si es necesario
        let jsonData;
        try {
          jsonData = JSON.parse(cleanJson);
        } catch (parseError) {
          // Si el JSON no es válido, intentar corregirlo agregando la llave de cierre
          const fixedJson = cleanJson.endsWith('}') ? cleanJson : `${cleanJson}}`;
          jsonData = JSON.parse(fixedJson);
        }

        setAiInsights(jsonData);
      } catch (jsonError) {
        throw new Error(`Error al parsear JSON: ${jsonError.message}`);
      }
    } catch (error) {
      console.error("Error al obtener análisis de la IA:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Análisis Financiero con IA</h2>
      <button onClick={fetchAIAnalysis} disabled={isLoading}>
        {isLoading ? "Analizando..." : "Obtener Análisis"}
      </button>

      {error && <p style={{ color: 'red' }}>Error: {error}</p>}

      {rawResponse && (
        <div>
          <h3>Respuesta sin procesar:</h3>
          <pre>{rawResponse}</pre>
        </div>
      )}

      {aiInsights && (
        <div>
          <h3>Resultados del Análisis</h3>
          <p><strong>Gastos Totales:</strong> ${aiInsights.gastosTotales}</p>
          <p><strong>Ahorros Totales:</strong> ${aiInsights.ahorrosTotales}</p>
          <p><strong>Análisis:</strong> {aiInsights.analisisGastos}</p>
          <p><strong>Progreso en Ahorros:</strong> {aiInsights.progresoAhorros}</p>

          <h4>Recomendaciones</h4>
          <ul>
            {aiInsights.recomendaciones.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <h4>Categorías de Mayor Gasto</h4>
          <ul>
            {aiInsights.categoriasMayorGasto.map((item, index) => (
              <li key={index}>{item}</li>
            ))}
          </ul>

          <p><strong>Potencial de Ahorro:</strong> ${aiInsights.potencialAhorro}</p>
        </div>
      )}
    </div>
  );
};

export default AIFinancialAnalysis;