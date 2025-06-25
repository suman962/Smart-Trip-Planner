import Nav from '../components/nav';
import ImageSlider from '../components/ImageSlider';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {CircularProgress} from "@heroui/progress";

const Trip = () => {
  const navigate = useNavigate();

  const [placePhotos, setPlacePhotos] = useState([]);
  const [placeDetails, setPlaceDetails] = useState(null);
  const [weatherHistory, setWeatherHistory] = useState(null);

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
              <div>
                {
                  placePhotos.length > 0 ? (
                    <ImageSlider images={placePhotos} />
                  ) : (
                    <p className="text-white">No photos available for this place.</p>
                  )
                }
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


export default Trip;