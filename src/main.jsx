import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

// Script to set initial dark mode
// This needs to run before React to avoid flash of wrong theme
const setInitialTheme = () => {
  // Check localStorage first
  const savedDarkMode = localStorage.getItem('darkMode');
  
  if (savedDarkMode === 'true') {
    document.documentElement.classList.add('dark');
  } else if (savedDarkMode === 'false') {
    document.documentElement.classList.remove('dark');
  } else {
    // If no localStorage, check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }
};

// Execute immediately
setInitialTheme();

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
