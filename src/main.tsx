import React from 'react';
import ReactDOM from 'react-dom/client';

import './global.css';


//Imports
import { AuthProvider } from './context/AuthContext';
import { BookingProvider } from './context/BookingContext';
import { BrowserRouter } from 'react-router-dom';
import App from './App';


ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
    <AuthProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
    </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
