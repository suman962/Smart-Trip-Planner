import Nav from '../components/Nav';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useShowTrip } from '../hooks/useShowTrip.jsx';

const Trip = () => {
  const navigate = useNavigate();

  const [bestTime, setBestTime] = useState(null);
  const [findButtonDisabled, setFindButtonDisabled] = useState(false);

  const placeId = new URLSearchParams(window.location.search).get('place');
  
  const { TripHtml, placePhotos, placeDetails, weatherHistory, weatherForecast } = useShowTrip(placeId);

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
    <div className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{ backgroundImage: "url('./assets/trip.png')" }}
    >
      <Nav currentPage='Search' className='bg-cyan-100/50' />

      <div className="min-h-screen pb-4">
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

export default Trip;
