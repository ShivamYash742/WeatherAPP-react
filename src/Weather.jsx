import React, { useState, useEffect, useRef } from "react";
import search_icon from "./assets/search.png";
import clear from "./assets/clear.png";
import cloud from "./assets/cloud.png";
import drizzle from "./assets/drizzle.png";
import humidity from "./assets/humidity.png";
import rain from "./assets/rain.png";
import snow from "./assets/snow.png";
import wind from "./assets/wind.png";

function Weather() {
  const inputref = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [localTime, setLocalTime] = useState("");
  const [timeInterval, setTimeInterval] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  const allicons = {
    "01d": clear,
    "01n": clear,
    "02d": cloud,
    "02n": cloud,
    "03d": cloud,
    "03n": cloud,
    "04d": drizzle,
    "04n": drizzle,
    "09d": rain,
    "09n": rain,
    "10d": rain,
    "10n": rain,
    "13d": snow,
    "13n": snow,
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    
    // Add or remove 'dark' class from HTML element
    document.documentElement.classList.toggle('dark', newDarkMode);
    
    // Store preference in localStorage
    localStorage.setItem('darkMode', newDarkMode ? 'true' : 'false');
  };

  const updateLocalTime = (timezone) => {
    // Clear any existing interval
    if (timeInterval) {
      clearInterval(timeInterval);
    }
    
    // Function to calculate and format local time
    const calculateTime = () => {
      const localDate = new Date();
      // Convert timezone offset from seconds to milliseconds
      const targetTime = new Date(localDate.getTime() + (timezone * 1000) + (localDate.getTimezoneOffset() * 60000));
      
      // Format time in 12-hour AM/PM format
      let hours = targetTime.getHours();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours ? hours : 12; // Convert hour '0' to '12'
      const minutes = targetTime.getMinutes().toString().padStart(2, '0');
      const seconds = targetTime.getSeconds().toString().padStart(2, '0');
      
      const formattedTime = `${hours}:${minutes}:${seconds} ${ampm}`;
      setLocalTime(formattedTime);
    };
    
    // Calculate initial time
    calculateTime();
    
    // Update time every second
    const intervalId = setInterval(calculateTime, 1000);
    setTimeInterval(intervalId);
  };

  // Sync dark mode with document class on initial load
  useEffect(() => {
    // Check localStorage first
    const savedDarkMode = localStorage.getItem('darkMode');
    
    if (savedDarkMode === 'true') {
      setDarkMode(true);
      document.documentElement.classList.add('dark');
    } else if (savedDarkMode === 'false') {
      setDarkMode(false);
      document.documentElement.classList.remove('dark');
    } else {
      // If no localStorage, check system preference
      const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
      setDarkMode(prefersDarkMode);
      document.documentElement.classList.toggle('dark', prefersDarkMode);
    }
  }, []);

  // Cleanup interval on component unmount
  useEffect(() => {
    return () => {
      if (timeInterval) clearInterval(timeInterval);
    };
  }, [timeInterval]);

  const search = async (city) => {
    if (city === "") {
      alert("Please enter a city name");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        alert("City not found");
        setIsLoading(false);
        return;
      }
      
      const icon = allicons[data.weather[0].icon] || clear;
      setWeatherData({
        humidity: data.main.humidity,
        temperature: Math.floor(data.main.temp),
        windSpeed: data.wind.speed,
        city: data.name,
        country: data.sys.country,
        description: data.weather[0].description,
        feelsLike: Math.floor(data.main.feels_like),
        pressure: data.main.pressure,
        icon: icon,
        timezone: data.timezone
      });
      
      // Update local time with the timezone data
      updateLocalTime(data.timezone);
    } catch (error) {
      setWeatherData(false);
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    search("New York");
  }, []);

  const handleSearch = () => {
    search(searchQuery);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Get greeting based on time
  const getGreeting = () => {
    const date = new Date();
    const hours = date.getHours();
    
    if (hours < 12) return "Good morning";
    if (hours < 18) return "Good afternoon";
    return "Good evening";
  };

  // Format current date
  const getCurrentDate = () => {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  return (
    <div className={`w-full max-w-5xl ${darkMode ? 'text-gray-100' : 'text-gray-800'} transition-colors duration-300`}>
      {/* Header with dark mode toggle */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">{getGreeting()}</h1>
          <p className="text-sm opacity-70">{getCurrentDate()}</p>
        </div>
        
        <button 
          className={`rounded-full p-2 ${darkMode ? 'bg-gray-700' : 'bg-gray-200'} transition-colors duration-300`}
          onClick={toggleDarkMode}
        >
          {darkMode ? (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                stroke="currentColor"
                fill="none" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24">
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
                stroke="currentColor"
                fill="none" />
            </svg>
          )}
        </button>
      </div>
      
      {/* Search bar */}
      <div className={`flex items-center gap-2 p-2 mb-8 rounded-xl ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
        <div className="flex-1 relative">
          <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
          </svg>
          <input
            type="text"
            placeholder="Search for a city..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className={`w-full py-3 pl-10 pr-4 rounded-lg outline-none ${darkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'bg-gray-100 text-gray-800 placeholder-gray-500'} transition-colors duration-300`}
          />
        </div>
        <button 
          onClick={handleSearch}
          className={`py-3 px-6 rounded-lg font-medium transition-colors duration-300 ${darkMode ? 'bg-indigo-600 hover:bg-indigo-700' : 'bg-indigo-500 hover:bg-indigo-600'} text-white`}
        >
          {isLoading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          ) : (
            'Search'
          )}
        </button>
      </div>
      
      {weatherData && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main weather card */}
          <div className={`col-span-1 md:col-span-2 rounded-2xl overflow-hidden transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
            <div className={`p-6 flex flex-col md:flex-row justify-between items-center gap-6 relative overflow-hidden ${darkMode ? 'from-indigo-900 to-purple-900' : 'from-blue-500 to-indigo-600'} bg-gradient-to-br`}>
              <div className="z-10">
                <h2 className="text-white text-4xl font-bold flex items-center gap-2">
                  {weatherData.city}
                  <span className="text-sm font-normal px-2 py-1 bg-white/20 rounded">{weatherData.country}</span>
                </h2>
                <p className="text-white/80 mt-1 capitalize">{weatherData.description}</p>
                <div className="mt-6">
                  <p className="text-6xl font-bold text-white">{weatherData.temperature}°C</p>
                  <p className="text-white/80 mt-1">Feels like {weatherData.feelsLike}°C</p>
                </div>
              </div>
              
              <div className="z-10 flex flex-col items-center">
                <img 
                  src={weatherData.icon} 
                  alt="Weather condition" 
                  className="w-32 h-32 drop-shadow-lg animate-float"
                />
                {localTime && (
                  <div className="bg-white/20 rounded-lg px-4 py-2 text-center mt-4">
                    <p className="text-white text-2xl">{localTime}</p>
                    <p className="text-white/80 text-sm">Local Time</p>
                  </div>
                )}
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32"></div>
              <div className="absolute bottom-0 left-0 w-40 h-40 bg-white/5 rounded-full -ml-20 -mb-20"></div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-300`}>
                <div className="flex items-center gap-3">
                  <img src={humidity} alt="Humidity" className={`w-10 ${darkMode ? 'brightness-0 invert' : ''}`} />
                  <div>
                    <p className="text-xl font-bold">{weatherData.humidity}%</p>
                    <p className="text-sm opacity-70">Humidity</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-300`}>
                <div className="flex items-center gap-3">
                  <img src={wind} alt="Wind" className={`w-10 ${darkMode ? 'brightness-0 invert' : ''}`} />
                  <div>
                    <p className="text-xl font-bold">{weatherData.windSpeed} km/h</p>
                    <p className="text-sm opacity-70">Wind Speed</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-300`}>
                <div className="flex items-center gap-3">
                  <svg className={`w-10 h-10 ${darkMode ? 'text-white' : 'text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  <div>
                    <p className="text-xl font-bold">{weatherData.pressure} hPa</p>
                    <p className="text-sm opacity-70">Pressure</p>
                  </div>
                </div>
              </div>
              
              <div className={`p-4 rounded-xl ${darkMode ? 'bg-gray-700' : 'bg-gray-100'} transition-colors duration-300`}>
                <div className="flex items-center gap-3">
                  <svg className={`w-10 h-10 ${darkMode ? 'text-white' : 'text-gray-800'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5.636 18.364a9 9 0 010-12.728m12.728 0a9 9 0 010 12.728m-9.9-2.829a5 5 0 010-7.07m7.072 0a5 5 0 010 7.07M13 12a1 1 0 11-2 0 1 1 0 012 0z"></path>
                  </svg>
                  <div>
                    <p className="text-xl font-bold">{weatherData.feelsLike}°C</p>
                    <p className="text-sm opacity-70">Feels Like</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Tips card */}
          <div className={`col-span-1 rounded-2xl p-6 transition-colors duration-300 ${darkMode ? 'bg-gray-800' : 'bg-white'} shadow-xl`}>
            <h2 className="text-xl font-bold mb-4">Weather Tips</h2>
            
            <div className="space-y-4">
              {weatherData.temperature > 30 && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-red-900/30' : 'bg-red-100'}`}>
                  <h3 className="font-medium">Heat Alert</h3>
                  <p className="text-sm mt-1 opacity-80">Stay hydrated and avoid direct sun exposure during peak hours.</p>
                </div>
              )}
              
              {weatherData.temperature < 5 && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  <h3 className="font-medium">Cold Alert</h3>
                  <p className="text-sm mt-1 opacity-80">Dress in warm layers and protect extremities from the cold.</p>
                </div>
              )}
              
              {weatherData.humidity > 80 && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-purple-900/30' : 'bg-purple-100'}`}>
                  <h3 className="font-medium">High Humidity</h3>
                  <p className="text-sm mt-1 opacity-80">High humidity may make it feel warmer. Stay cool and hydrated.</p>
                </div>
              )}
              
              {weatherData.windSpeed > 20 && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-yellow-900/30' : 'bg-yellow-100'}`}>
                  <h3 className="font-medium">Wind Advisory</h3>
                  <p className="text-sm mt-1 opacity-80">Strong winds may affect outdoor activities. Secure loose objects.</p>
                </div>
              )}
              
              {weatherData.description.includes("rain") && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-blue-900/30' : 'bg-blue-100'}`}>
                  <h3 className="font-medium">Rain Expected</h3>
                  <p className="text-sm mt-1 opacity-80">Don't forget your umbrella and waterproof clothing.</p>
                </div>
              )}

              {weatherData.description.includes("cloud") && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-gray-700/30' : 'bg-gray-100'}`}>
                  <h3 className="font-medium">Cloudy Conditions</h3>
                  <p className="text-sm mt-1 opacity-80">Good day for outdoor activities without direct sunlight.</p>
                </div>
              )}
              
              {weatherData.description.includes("clear") && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-orange-900/30' : 'bg-orange-100'}`}>
                  <h3 className="font-medium">Clear Skies</h3>
                  <p className="text-sm mt-1 opacity-80">Perfect day for outdoor activities. Don't forget sunscreen!</p>
                </div>
              )}
              
              {!weatherData.description.includes("rain") && 
               !weatherData.description.includes("cloud") && 
               !weatherData.description.includes("clear") && 
               weatherData.temperature >= 5 && 
               weatherData.temperature <= 30 && 
               weatherData.humidity <= 80 && 
               weatherData.windSpeed <= 20 && (
                <div className={`p-4 rounded-lg ${darkMode ? 'bg-green-900/30' : 'bg-green-100'}`}>
                  <h3 className="font-medium">Good Weather</h3>
                  <p className="text-sm mt-1 opacity-80">Comfortable conditions for most outdoor activities.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      {/* Loading state */}
      {isLoading && !weatherData && (
        <div className="flex justify-center items-center h-64">
          <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      
      {/* Footer */}
      <div className="mt-8 text-center">
        <p className="text-xs opacity-50">Weather data provided by OpenWeatherMap</p>
      </div>
    </div>
  );
}

export default Weather;
