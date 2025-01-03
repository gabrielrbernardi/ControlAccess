import React from 'react';
import * as ReactDOMClient from 'react-dom';
import './index.css';
import App from './App';

import PrimeReact from 'primereact/api';

// import "primereact/resources/themes/arya-blue/theme.css";  //theme
// import "primereact/resources/themes/lara-light-blue/theme.css"
import "primereact/resources/themes/saga-blue/theme.css"
import "primereact/resources/primereact.min.css";                  //core css
import "primeicons/primeicons.css";                                //icons
import "/node_modules/primeflex/primeflex.css"                     //biblioteca com utilidades para CSS. similar ao bootstrap

PrimeReact.ripple = true;

const container = document.getElementById('root')!;
// @ts-ignore
const root = ReactDOMClient.createRoot(container);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
