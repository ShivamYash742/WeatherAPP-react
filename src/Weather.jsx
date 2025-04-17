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
    
    if (newDarkMode) {
      document.body.classList.add('dark');
    } else {
      document.body.classList.remove('dark');
    }
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
    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${
        import.meta.env.VITE_APP_ID
      }`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) {
        alert("City not found");
        return;
      }
      console.log(data);
      const icon = allicons[data.weather[0].icon] || clear;
      setWeatherData({
        humidity: data.main.humidity,
        temperature: Math.floor(data.main.temp),
        windSpeed: data.wind.speed,
        city: data.name,
        icon: icon,
        timezone: data.timezone // Timezone offset in seconds from UTC
      });
      
      // Update local time with the timezone data
      updateLocalTime(data.timezone);
    } catch (error) {
      setWeatherData(false);
      console.error(error);
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

  return (
    <>
      <button 
        className="absolute top-5 right-5 bg-white/20 hover:bg-white/30 rounded-full w-12 h-12 flex items-center justify-center cursor-pointer transition-all duration-300"
        onClick={toggleDarkMode}
      >
        {darkMode ? (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="text-white">
            <path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              stroke="white"
              fill="none" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="24" height="24" className="text-white">
            <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" 
              strokeWidth="2" 
              strokeLinecap="round" 
              strokeLinejoin="round"
              stroke="white"
              fill="none" />
          </svg>
        )}
      </button>
      
      <div className={`flex flex-col items-center p-10 rounded-3xl ${darkMode ? 'bg-gradient-to-br from-indigo-900 to-purple-800' : 'bg-gradient-to-br from-blue-500 to-purple-600'} shadow-2xl max-w-md w-11/12 transition-all duration-300`}>
        <div className="flex items-center gap-3 w-full mb-4">
          <input
            type="text"
            placeholder="Search city"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={handleKeyPress}
            className="h-14 border-none outline-none rounded-full py-2 px-6 text-gray-700 text-lg flex-1 shadow-md transition-all duration-300 focus:shadow-lg bg-white/90"
          />
          <div 
            onClick={handleSearch}
            className="w-14 h-14 p-4 rounded-full cursor-pointer bg-white shadow-md transition-all duration-300 hover:scale-105 hover:bg-blue-50 flex items-center justify-center"
          >
            <img src={search_icon} alt="Search" className="w-full h-full" />
          </div>
        </div>
        
        {weatherData && (
          <>
            <img 
              src={weatherData.icon} 
              alt="Weather condition" 
              className="w-32 my-6 drop-shadow-xl animate-float"
            />
            <p className="text-white text-8xl font-bold leading-none mb-1 text-shadow">{weatherData.temperature}°C</p>
            <p className="text-white text-4xl font-medium mb-6 text-shadow">{weatherData.city}</p>
            
            {localTime && (
              <div className="text-white text-2xl font-medium mb-6 text-shadow flex flex-col items-center">
                <p>{localTime}</p>
                <span className="text-sm font-normal opacity-90">Local Time</span>
              </div>
            )}
            
            <div className="flex justify-center gap-10 w-full mt-5 text-white bg-white/15 backdrop-blur-md p-6 rounded-xl">
              <div className="flex items-start gap-4 text-2xl font-semibold">
                <img src={humidity} alt="Humidity" className="w-8 mt-2 brightness-0 invert" />
                <div>
                  <p>{weatherData.humidity}%</p>
                  <span className="block text-base font-normal mt-1 opacity-90">Humidity</span>
                </div>
              </div>
              <div className="flex items-start gap-4 text-2xl font-semibold">
                <img src={wind} alt="Wind speed" className="w-8 mt-2 brightness-0 invert" />
                <div>
                  <p>{weatherData.windSpeed} km/h</p>
                  <span className="block text-base font-normal mt-1 opacity-90">Wind Speed</span>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
}

export default Weather;
