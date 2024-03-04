import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { Router } from './public/router/menu-router';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import 'material-dashboard/assets/css/nucleo-icons.css';
import 'material-dashboard/assets/css/nucleo-svg.css';
import 'material-dashboard/assets/css/material-dashboard.css';
import 'material-dashboard/assets/js/material-dashboard.min.js';
import 'material-dashboard/assets/js/core/bootstrap.min.js';
import 'material-dashboard/assets/js/core/popper.min.js';

const container = document.getElementById('root');
const root = createRoot(container!);
root.render(
  <React.StrictMode>
    <Router />
  </React.StrictMode>
);