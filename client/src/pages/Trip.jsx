import Nav from '../components/Nav';
import ImageSlider from '../components/ImageSlider';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {CircularProgress} from "@heroui/progress";

const Trip = () => {
  const navigate = useNavigate();

  const [bestTime, setBestTime] = useState(null);
  const [findButtonDisabled, setFindButtonDisabled] = useState(false);

  const placeId = new URLSearchParams(window.location.search).get('place');
  
  const { TripHtml, placePhotos, placeDetails, weatherHistory, weatherForecast } = showTrip(placeId);

  useEffect(() => {
    if (!placeId) {
      navigate('/search');
    }
  }, [placeId, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (!token || !expiry || new Date(expiry) < new Date()) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiry');
      navigate('/login');
    }

  }, []);

  const fetchBestTimeToVisit = async (timeFrame) => {
    if (!weatherHistory || !weatherForecast) {
      return;
    }
    
    setFindButtonDisabled(true);

    try {
      const response = await fetch('http://localhost:3400/api/weatherbesttime', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          history: weatherHistory,
          forecast: weatherForecast,
          toFind: timeFrame
        }),
      });
      const data = await response.json();
      setBestTime(data);
      
    } catch (error) {
      console.error('Error fetching best time to visit:', error);
    }
  };

  async function handleSave(e) {
    e.preventDefault();
    const token = localStorage.getItem('token');
    
    const checkTokenResponse = await fetch(`http://localhost:3400/api/db/checktoken?token=${token}`);
    const checkTokenData = await checkTokenResponse.json();
    if (checkTokenData.error) {
      console.error("Token check failed:", checkTokenData.error);
      return;
    }
    const email = checkTokenData.email;

    let imageBase64 = null;
    if (placePhotos.length > 0) {
      const response = await fetch(placePhotos[Math.floor(Math.random() * placePhotos.length)]);
      const blob = await response.blob();
      const reader = new FileReader();
      imageBase64 = await new Promise(resolve => {
        reader.onload = () => resolve(reader.result);
        reader.readAsDataURL(blob);
      });
    }

    const tripData = {
      placeId: placeId,
      name: placeDetails.formattedAddress,
      bestTime: bestTime,
      image: imageBase64
    };
    const response = await fetch('http://localhost:3400/api/db/savetrip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, tripData }),
    });
    const data = await response.json();
    if (data.error) {
      console.error("Error saving trip:", data.error);
      return;
    }
    navigate('/trips');
  }

  return (
    <div className={`bg-[#214a68] min-h-screen`}>
      <Nav currentPage='Search' className='bg-cyan-100/70' />

      <div className="flex flex-col items-center min-h-screen pb-4">
        {TripHtml}

        {weatherHistory && (
          <div className="w-full p-4 mt-4 lg:mt:8 flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl text-white mb-4">Plan To Visit</h2>
            {bestTime ? (
            <div className="flex flex-col items-center gap-4">
              <div className="bg-slate-500/30 text-gray-100 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-md w-full max-w-md text-center">
                <p className="font-normal md:text-lg">The best time to visit is:</p>
                <p className="font-bold md:text-xl">{bestTime}</p>
              </div>
              <div>
                <button 
                  className='mt-4 bg-blue-500 text-white md:text-lg px-5 py-2 rounded-xl hover:bg-blue-600'
                  onClick={handleSave}
                >
                  Save
                </button>
              </div>
            </div>
          ) : (
            <div className='grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-5'>
              <button 
                className='bg-blue-500 text-white px-4 py-2 rounded-md' 
                onClick={() => fetchBestTimeToVisit(7)}
                disabled={findButtonDisabled}
              >
                In next 7 days
              </button>
              <button 
                className='bg-blue-500 text-white px-4 py-2 rounded-md' 
                onClick={() => fetchBestTimeToVisit(30)}
                disabled={findButtonDisabled}
              >
                In next 30 days
              </button>
              <button 
                className='bg-blue-500 text-white px-4 py-2 rounded-md' 
                onClick={() => fetchBestTimeToVisit(90)}
                disabled={findButtonDisabled}
              >
                In next 90 days
              </button>
              <button 
                className='bg-blue-500 text-white px-4 py-2 rounded-md' 
                onClick={() => fetchBestTimeToVisit(365)}
                disabled={findButtonDisabled}
              >
                Best time to visit
              </button>
            </div>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

function showTrip(placeId) {
  const [placePhotos, setPlacePhotos] = useState([]);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [weatherForecast, setWeatherForecast] = useState(null);
  const [weatherHistory, setWeatherHistory] = useState(null);

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

  useEffect(() => {
    const fetchPlaceDetails = async () => {
      if (!placeId) {
        return;
      }
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
        setWeatherForecast(data);
      } catch (error) {
        console.error('Error fetching weather forecast:', error);
      } 
    }
    fetchWeatherForecast();
  }, [placeDetails]);

  const TripHtml = !placeId ? null : (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl lg:text-4xl text-white my-4 p-2">
        {placeDetails ? placeDetails.formattedAddress : 'Loading...'}
      </h1>
      
      {weatherHistory ? (
        <div className='flex flex-wrap justify-center items-center'>
          <div className='overflow-hidden'>
            {placePhotos.length > 0 ? (
              <ImageSlider key={`slider-${placePhotos.length}`} images={placePhotos} />
            ) : (
              <p className="text-white">No photos available for this place.</p>
            )}
          </div>
          
          <div className="w-full p-4 mt-4 lg:mt:8 flex flex-col items-center">
            <h2 className="text-2xl md:text-3xl text-white mb-4">Weather Forecast</h2>
            {weatherForecast ? (
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
              <p className="text-white text-center">Loading weather forecast...</p>
            )}
          </div>
        </div>
      ) : (
        <div className='mt-30 md:mt-50 flex flex-wrap justify-center items-center'>
          <CircularProgress aria-label="Loading..." />
          <h1 className="text-white text-3xl ml-4">Loading...</h1>
        </div>
      )}
    </div>
  );

  return { TripHtml, placePhotos, placeDetails, weatherHistory, weatherForecast };
}

export default Trip;
export { showTrip };
