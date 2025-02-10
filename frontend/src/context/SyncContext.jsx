import React, { createContext, useEffect } from 'react';
import apiService from '../services/api.js';

export const SyncContext = createContext();

export const SyncProvider = ({ children }) => {
  useEffect(() => {
    const syncSavings = async () => {
      try {
        const localSavings = JSON.parse(localStorage.getItem('savings') || '[]');
        
        for (let saving of localSavings) {
          if (saving.status === 'pendiente') {
            try {
              const syncedSaving = await apiService.savings.create(saving);
              
              const updatedLocalSavings = localSavings.map(s => 
                s.id === saving.id ? syncedSaving : s
              );
              localStorage.setItem('savings', JSON.stringify(updatedLocalSavings));
            } catch (syncError) {
              console.error('Error sincronizando saving:', syncError);
            }
          }
        }
      } catch (error) {
        console.error('Error en sincronización:', error);
      }
    };

    syncSavings();
  }, []);

  return (
    <SyncContext.Provider value={{}}>
      {children}
    </SyncContext.Provider>
  );
};