import Nav from '../components/nav';
import ImageSlider from '../components/ImageSlider';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {CircularProgress} from "@heroui/progress";

const Trip = () => {
  const navigate = useNavigate();

  const [placePhotos, setPlacePhotos] = useState([]);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [weatherHistory, setWeatherHistory] = useState(null);
  const [bestTime, setBestTime] = useState(null);

  const placeId = new URLSearchParams(window.location.search).get('place');

  useEffect(() => {
    if (!placeId) {
      navigate('/search');
    }
  }, [placeId, navigate]);

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      try {
        const response = await fetch(`http://localhost:3400/api/place?id=${placeId}`);
        const placeDetails = await response.json();
        setPlaceDetails(placeDetails);
        if (placeDetails.photos) {
          const fetchPhoto = async (photo) => {
            const response = await fetch(`http://localhost:3400/api/placephoto?photo=${photo.name}`);
            const blob = await response.blob();
            const img = URL.createObjectURL(blob);
            
            setPlacePhotos(prev => [...prev, img]);
          };

          placeDetails.photos.forEach(photo => {
            fetchPhoto(photo);
          });
        }

      } catch (error) {
        console.error('Error fetching place details:', error);
      }
    };

    fetchPlaceDetails();
  }, [placeId]);

  useEffect(() => {
    const fetchWeatherHistory = async () => {
      if (!placeDetails || !placeDetails.location) {
          return;
      }
      const { latitude, longitude } = placeDetails.location;
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - 5 * 365); 

      const endDate = new Date();

      try {
        const response = await fetch('http://localhost:3400/api/weatherhistory', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
            start_date: startDate.toISOString().split('T')[0],
            end_date: endDate.toISOString().split('T')[0],
          }),
        });

        const data = await response.json();
        setWeatherHistory(data);
      } catch (error) {
        console.error('Error fetching weather history:', error);
      }
    };
    
    fetchWeatherHistory();
  }, [placeDetails]);

  useEffect(() => {
    const fetchWeatherForecast = async () => {
      if (!placeDetails || !placeDetails.location) {
        return;
      }
      const { latitude, longitude } = placeDetails.location;
      try {
        const response = await fetch('http://localhost:3400/api/weatherforecast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            latitude: latitude,
            longitude: longitude,
          }),
        });

        const data = await response.json();
        console.log('Weather Forecast Data:', data);
        setWeatherForecast(data);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
      } 
    }
    fetchWeatherForecast();
  }, [placeDetails]);

  // this function should wait for history and forecast to be fetched
  useEffect(() => {
    const fetchBestTimeToVisit = async () => {
      if (!weatherHistory || !weatherForecast) {
        return;
      }
      try {
        const response = await fetch('http://localhost:3400/api/weatherbesttime', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            history: weatherHistory,
            forecast: weatherForecast,
            toFind: 365
          }),
        });

        const data = await response.json();
        console.log('Best Time to Visit Data:', data);
        setBestTime(data);
      } catch (error) {
        console.error('Error fetching best time to visit:', error);
      }
    }
    fetchBestTimeToVisit();
  }, [weatherHistory, weatherForecast, placeDetails]);

  return (
    <div className={`bg-[#214a68] h-screen`}>
      <Nav currentPage='Search' className='bg-cyan-100/70' />

      <div className="flex flex-col items-center h-full">
        <h1 className="text-3xl lg:text-4xl text-white my-4 p-2">{
          placeDetails ? placeDetails.formattedAddress : 'Loading...'
        }
        </h1>
        
        {
          weatherHistory ? (
            <div className='flex flex-wrap justify-center items-center'>
              <div className='overflow-hidden'>
                {
                  placePhotos.length > 0 ? (
                    <ImageSlider images={placePhotos} />
                  ) : (
                    <p className="text-white">No photos available for this place.</p>
                  )
                }
              </div>
              <div className="w-full p-4 mt-4 lg:mt:8 flex flex-col items-center">
                <h2 className="text-2xl text-white mb-4">Weather Forecast</h2>
                {
                  weatherForecast ? (
                    <div className="flex overflow-x-auto md:justify-center gap-1 md:gap-3 pb-2 w-full">
                      {weatherForecast.daily.time.slice(0, 7).map((date, index) => (
                        <div key={index} className="bg-white p-1.5 md:p-3 rounded-lg shadow-md min-w-[50px] md:min-w-[120px] flex-shrink-0">
                          <div className="flex flex-col items-center">
                            <h3 className="text-xs md:text-sm font-semibold text-center mb-0.5 md:mb-1 leading-tight">
                              {new Date(date).toLocaleDateString('en-US', { 
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </h3>
                            <span className="text-base md:text-2xl mb-0.5 md:mb-2">
                              {getWeatherEmoji(
                                weatherForecast.daily.weather_code?.[index], 
                                weatherForecast.daily.precipitation_sum[index]
                              )}
                            </span>
                            <div className="text-xs md:text-sm space-y-0 md:space-y-1">
                              <p className="font-medium text-center">{weatherForecast.daily.temperature_2m_max[index]}° C</p>
                              <p className="text-gray-600 text-center text-[9px] md:text-xs">FL: {weatherForecast.daily.temperature_2m_min[index]}° C</p>
                              <p className="text-blue-600 text-center text-[10px] md:text-[13px]">{weatherForecast.daily.precipitation_sum[index]} mm</p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-white">Loading weather forecast...</p>
                  )
                }
              </div>
              <div>
                <h2 className="text-2xl text-white mb-4">Plan To Visit</h2>
                <button>In next 7 days</button>
                <button>In next 30 days</button>
                <button>In next 90 days</button>
                <button>Best time to visit</button>
              </div>
            </div>

          ) : (
            <div className='mt-30 md:mt-50 flex flex-wrap justify-center items-center'>
              <CircularProgress aria-label="Loading..." />;
              <h1 className="text-white text-3xl">Loading...</h1>
            </div>
          )
        }
      </div>
    </div>
  );
}

const getWeatherEmoji = (weatherCode, precipitation) => {
    // Weather code mapping based on WMO codes
    if (precipitation > 0) {
      if (precipitation > 10) return '🌧️'; // Heavy rain
      return '🌦️'; // Light rain
    }
    
    switch (weatherCode) {
      case 0: return '☀️'; // Clear sky
      case 1: return '🌤️'; // Mainly clear
      case 2: return '⛅'; // Partly cloudy
      case 3: return '☁️'; // Overcast
      case 45:
      case 48: return '🌫️'; // Fog
      case 51:
      case 53:
      case 55: return '🌦️'; // Drizzle
      case 61:
      case 63:
      case 65: return '🌧️'; // Rain
      case 71:
      case 73:
      case 75: return '🌨️'; // Snow
      case 80:
      case 81:
      case 82: return '🌦️'; // Rain showers
      case 95: return '⛈️'; // Thunderstorm
      default: return '🌤️'; // Default
    }
  };

export default Trip;