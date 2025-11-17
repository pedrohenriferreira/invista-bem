import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import ErrorBoundary from './components/ErrorBoundary.tsx'
import './index.css'

console.log('🚀 Iniciando aplicação Invista Bem...');

const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error('Root element not found');
}

createRoot(rootElement).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

console.log('✅ Aplicação renderizada com sucesso!');
