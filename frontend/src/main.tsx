import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import '@fontsource/plus-jakarta-sans/400.css';
import '@fontsource/plus-jakarta-sans/600.css';
import '@fontsource/plus-jakarta-sans/700.css';
import '@fontsource/pretendard/400.css';
import '@fontsource/pretendard/600.css';
import '@fontsource/pretendard/700.css';
import App from './App.tsx';
import { AppProviders } from './app/providers/AppProviders.tsx';
import './theme/global.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProviders>
      <App />
    </AppProviders>
  </StrictMode>,
);
