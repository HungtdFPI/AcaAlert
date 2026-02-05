import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ErrorBoundary } from './components/ErrorBoundary.tsx'

// Global Error Trap
// Global Error Trap - Catch Synchronous Errors
window.onerror = function (message, source, lineno, colno, error) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace; background: #fff; height: 100vh; overflow: auto;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">CRITICAL ERROR</h1>
        <p style="font-size: 16px; margin-bottom: 20px;">${message}</p>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; overflow-x: auto;">
           <pre>${source}:${lineno}:${colno}</pre>
           <pre>${error?.stack || ''}</pre>
        </div>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; font-size: 16px;">Reload App</button>
      </div>
    `;
  }
};

// Global Error Trap - Catch Promise Rejections (Async Errors)
window.onunhandledrejection = function (event) {
  const root = document.getElementById('root');
  if (root) {
    root.innerHTML = `
      <div style="padding: 20px; color: red; font-family: monospace; background: #fff; height: 100vh; overflow: auto;">
        <h1 style="font-size: 24px; margin-bottom: 10px;">ASYNC ERROR</h1>
        <p style="font-size: 16px; margin-bottom: 20px;">${event.reason?.message || event.reason}</p>
        <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; overflow-x: auto;">
           <pre>${event.reason?.stack || 'No stack trace'}</pre>
        </div>
        <button onclick="window.location.reload()" style="margin-top: 20px; padding: 10px 20px; background: #3b82f6; color: white; border: none; border-radius: 5px; font-size: 16px;">Reload App</button>
      </div>
    `;
  }
};

try {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </StrictMode>,
  );
} catch (e) {
  console.error("Render failed", e);
}

