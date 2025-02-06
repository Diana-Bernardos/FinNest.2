import React, { useState, useEffect, useCallback } from 'react';

const AppTour = () => {
  const [step, setStep] = useState(0);
  const [showTour, setShowTour] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const STEP_DURATION = 5000;

  const completeTour = useCallback(() => {
    localStorage.setItem('tourCompleted', 'true');
    setShowTour(false);
  }, []);

  const handleNext = () => {
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      completeTour();
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleSkip = () => {
    completeTour();
  };

  const steps = [
    {
      title: "¡Bienvenido a FinNest!",
      content: "Una aplicación inteligente para gestionar tus finanzas personales.",
      gradient: "bg-gradient-to-r from-blue-500 to-teal-400"
    },
    {
      title: "Panel de Resumen",
      content: "Visualiza tus gastos mensuales, ahorros totales y metas activas en un solo lugar.",
      gradient: "bg-gradient-to-r from-green-400 to-emerald-500"
    },
    {
      title: "Gestión de Ahorros",
      content: "Establece metas de ahorro y haz seguimiento de tu progreso de forma sencilla.",
      gradient: "bg-gradient-to-r from-yellow-400 to-orange-500"
    },
    {
      title: "Control de Gastos",
      content: "Registra y categoriza tus gastos para mantener un mejor control de tus finanzas.",
      gradient: "bg-gradient-to-r from-purple-500 to-indigo-600"
    },
    {
      title: "Análisis Inteligente",
      content: "Obtén recomendaciones personalizadas basadas en tus patrones de gasto y ahorro.",
      gradient: "bg-gradient-to-r from-pink-500 to-red-500"
    }
  ];

  useEffect(() => {
    const tourCompleted = localStorage.getItem('tourCompleted');
    if (tourCompleted) {
      setShowTour(false);
    }
  }, []);

  useEffect(() => {
    let timer;
    if (showTour && !isPaused) {
      timer = setTimeout(() => {
        if (step < steps.length - 1) {
          setStep(step + 1);
        } else {
          completeTour();
        }
      }, STEP_DURATION);
    }
    return () => clearTimeout(timer);
  }, [step, showTour, isPaused, steps.length, completeTour]);

  if (!showTour) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className={`h-2 rounded-t-lg ${steps[step].gradient}`} />
        
        <div className="relative h-1 bg-gray-200">
          <div 
            className={`absolute left-0 top-0 h-full transition-all duration-100 ${steps[step].gradient}`}
            style={{ 
              width: !isPaused ? '100%' : '0%', 
              transition: !isPaused ? `width ${STEP_DURATION}ms linear` : 'none'
            }}
          />
        </div>

        <div className="p-6">
          <h2 className={`text-2xl font-semibold mb-4 bg-clip-text text-transparent ${steps[step].gradient}`}>
            {steps[step].title}
          </h2>
          
          <p className="text-gray-600 mb-6">
            {steps[step].content}
          </p>

          <div className="flex items-center justify-between">
            <div className="space-x-2 flex items-center">
              {step > 0 && (
                <button
                  onClick={handlePrev}
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                >
                  Anterior
                </button>
              )}
              <button
                onClick={handleNext}
                className={`text-white px-4 py-2 rounded-lg transition-colors ${steps[step].gradient}`}
              >
                {step === steps.length - 1 ? 'Finalizar' : 'Siguiente'}
              </button>
              <button
                onClick={() => setIsPaused(!isPaused)}
                className="ml-2 p-2 text-gray-600 hover:text-gray-800"
              >
                {isPaused ? '▶️' : '⏸️'}
              </button>
            </div>
            <button
              onClick={handleSkip}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Saltar tour
            </button>
          </div>

          <div className="mt-4 flex justify-center space-x-2">
            {steps.map((_, index) => (
              <div
                key={index}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === step ? steps[step].gradient : 'bg-gray-300'
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppTour;