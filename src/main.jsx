import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { QueryClient, QueryClientProvider } from 'react-query';
import App from './App.jsx'
import './index.css'

// QueryClient 생성
const queryClient = new QueryClient();

createRoot(document.getElementById('root')).render(
  //<StrictMode>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  //</StrictMode>,  //StrictMode 사용하면 잔상 남음
)
