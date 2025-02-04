// Validación para números
export const isNumeric = (value, min = 0) => {
    const number = parseFloat(value);
    return !isNaN(number) && number >= min;
  };
  
  // Validación para fechas
  export const isDate = (dateString) => {
    const date = new Date(dateString);
    return date instanceof Date && !isNaN(date);
  };
  
  // Categorías válidas para gastos
  export const VALID_CATEGORIES = [
    'alimentación',
    'transporte',
    'vivienda',
    'servicios',
    'educación',
    'entretenimiento',
    'salud',
    'otros',
  ];