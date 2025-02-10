import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource/inter';
import './styles/tailwind.css';
import App from './App.jsx';
import { SyncProvider } from './context/SyncContext.jsx'; // Importar el SyncProvider

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <SyncProvider>
  <React.StrictMode>
    <App />
  </React.StrictMode>
  </SyncProvider>
);