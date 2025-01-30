import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import './styles/tailwind.css';
import App from './App';
import { SyncProvider } from './context/SyncContext'; // Importar el SyncProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SyncProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </SyncProvider>
);