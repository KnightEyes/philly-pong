import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App'; // Adjust path if App.tsx is in the same folder

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);