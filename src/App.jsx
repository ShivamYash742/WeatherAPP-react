import Weather from "./Weather.jsx";
import { useEffect, useState } from "react";

function App() {
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Function to check if dark mode is active
    const checkDarkMode = () => {
      return document.documentElement.classList.contains('dark');
    };

    // Initial check
    setDarkMode(checkDarkMode());

    // Create observer to watch for class changes on html element
    const observer = new MutationObserver(() => {
      setDarkMode(checkDarkMode());
    });

    // Start observing
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    // Cleanup
    return () => observer.disconnect();
  }, []);

  // Define background style based on dark mode
  const appStyle = {
    backgroundColor: darkMode ? '#111827' : '#EBF5FF',
    minHeight: '100vh',
    margin: 0,
    padding: 0,
    transition: 'background-color 0.3s ease'
  };

  return (
    <div style={appStyle}>
      <div className="container mx-auto py-8 px-4">
        <Weather />
      </div>
    </div>
  );
}

export default App;
