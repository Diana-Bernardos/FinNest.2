// src/utils/localStorageUtils.js
export const saveToLocalStorage = (key, data) => {
    try {
      const serializedData = JSON.stringify(data);
      localStorage.setItem(key, serializedData);
      return true;
    } catch (error) {
      console.error("Error guardando en localStorage:", error);
      return false;
    }
  };
  
  export const getFromLocalStorage = (key) => {
    try {
      const serializedData = localStorage.getItem(key);
      return serializedData ? JSON.parse(serializedData) : null;
    } catch (error) {
      console.error("Error obteniendo de localStorage:", error);
      return null;
    }
  };
  
  export const clearLocalStorage = (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error("Error limpiando localStorage:", error);
      return false;
    }
  };