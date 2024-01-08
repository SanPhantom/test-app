import 'default-passive-events';
import ReactDOM from 'react-dom/client';
import './base.css';
import './index.css';
import TestLyric from './pages/TestLyric';
import React from 'react';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    {/* <App /> */}
    <TestLyric />,{/* <JotaiTest /> */}
    {/* <VirtualMasonry /> */}
  </React.StrictMode>
);
