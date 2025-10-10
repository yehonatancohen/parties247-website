import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { PartyProviderInitialState } from './types';

declare global {
  interface Window {
    __PARTIES247_BOOTSTRAP__?: PartyProviderInitialState;
  }
}

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Could not find root element to mount to');
}

const bootstrapData = window.__PARTIES247_BOOTSTRAP__;
if (bootstrapData) {
  delete window.__PARTIES247_BOOTSTRAP__;
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <HelmetProvider>
      <BrowserRouter>
        <App initialState={bootstrapData} />
      </BrowserRouter>
    </HelmetProvider>
  </React.StrictMode>,
);
