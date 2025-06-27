import Nav from '../components/Nav';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useShowTrip } from '../hooks/useShowTrip.jsx';

const Trips = () => {
  const [tripIdPresent, setTripIdPresent] = useState(false);
  const [trip, setTrip] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const { TripHtml, weatherHistory } = useShowTrip(trip?.placeId || null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (!token || !expiry || new Date(expiry) < new Date()) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiry');
      navigate('/login');
    }
  }, []);

  useEffect(() => {
    const fetchTrip = async () => {
      const token = localStorage.getItem('token');
      const checkTokenResponse = await fetch(`http://localhost:3400/api/db/checktoken?token=${token}`);
      const checkTokenData = await checkTokenResponse.json();
      if (checkTokenData.error) {
        console.error("Token check failed:", checkTokenData.error);
        return;
      }
      const email = checkTokenData.email;
      
      const tripId = new URLSearchParams(window.location.search).get('tripid');
      
      if (tripId) {
        // for when tripId is present in the URL
        setTripIdPresent(true);
        const fetchTripResponse = await fetch(`http://localhost:3400/api/db/gettrips?tripId=${tripId}`);
        const fetchTripData = await fetchTripResponse.json();
        if (fetchTripData.error) {
          console.error("Fetch trip failed:", fetchTripData.error);
          return;
        }
        if (fetchTripData.email !== email) {
          navigate('/trips');
          return;
        }
        setTrip(fetchTripData);
      } else {
        // Fetch all trips
        setTripIdPresent(false);
        const fetchTripsResponse = await fetch(`http://localhost:3400/api/db/gettrips?email=${email}`);
        const fetchTripsData = await fetchTripsResponse.json();
        if (fetchTripsData.error) {
          console.error("Fetch trips failed:", fetchTripsData.error);
          return;
        }
        setTrip(fetchTripsData);
      }
    };

    fetchTrip();
  }, [location.search]); 

  async function handleDeleteTrip(tripId) {
    const token = localStorage.getItem('token');
    const checkTokenResponse = await fetch(`http://localhost:3400/api/db/checktoken?token=${token}`);
    const checkTokenData = await checkTokenResponse.json();
    if (checkTokenData.error) {
      console.error("Token check failed:", checkTokenData.error);
      return;
    }
    const email = checkTokenData.email;
    
    const deleteTripResponse = await fetch('http://localhost:3400/api/db/deletetrip', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, tripId }),
    });

    const deleteTripData = await deleteTripResponse.json();
    if (deleteTripData.error) {
      console.error("Delete trip failed:", deleteTripData.error);
      return;
    }

    setTrip((prevTrips) => prevTrips.filter(t => t._id !== tripId));
  }

  return (
    <div 
      className="min-h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{ backgroundImage: "url('./assets/trips.png')" }}
    >
      <Nav currentPage='Trips'/>
      <div>
        {
          tripIdPresent ? (
            <div className="flex flex-col items-center min-h-screen">
              {trip && TripHtml}
              {weatherHistory && (
                <div className="bg-slate-500/30 text-gray-100 backdrop-blur-md border border-white/20 p-3 rounded-lg shadow-md w-full max-w-md text-center">
                  <p className="font-normal md:text-lg">The best time to visit is:</p>
                  <p className="font-bold md:text-xl">{trip.bestTime}</p>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl font-bold text-white my-4 md:mt-8 text-shadow-lg/75">Your Trips</h1>
              {
                trip && trip.length > 0 ? (
                  <ul className="text-white flex flex-col items-center my-4">
                    {trip.map((t) => (
                      <li key={t._id} className="mb-2">
                        <div className='w-80 md:w-120 lg:w-150 h-25 px-1.5 border border-gray-300 rounded-lg shadow-lg hover:bg-gray-800/10 flex flex-row items-center gap-5 backdrop-blur-lg relative'>
                          <Link
                            to={`/trips?tripid=${t._id}`} 
                            className="text-blue-400 hover:underline flex flex-row items-center gap-5 flex-1"
                          >
                            <div>
                              <img 
                                src={t.image}
                                className="object-cover rounded-lg size-22"
                              />
                            </div>
                            <div className='text-shadow-lg/50'>
                              <h2 className="text-lg font-semibold text-white">{t.name}</h2>
                              <p className="text-sm text-gray-400">Saved on: {new Date(t.createdAt).toLocaleDateString()}</p>
                            </div>
                          </Link>
                          <div className="ml-auto text-gray-400 hover:text-red-400/90 pr-3 cursor-pointer">
                            <i className="fa fa-trash text-shadow-lg/50 !text-lg md:!text-xl lg:!text-2xl" 
                              aria-hidden="true"
                              onClick={() => handleDeleteTrip(t._id)}
                            ></i>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-6 md:mt-12 lg:mt-20 text-white md:text-lg text-center text-shadow-lg/85">
                    No trips found.<br />Start planning your first trip!
                    <br />
                    <Link to="/search" className="text-blue-500 hover:text-blue-300 hover:underline mt-2 text-shadow-lg/30">
                      Search for places
                    </Link>
                  </p>
                )
              }
            </div>
          )
        }
      </div>

    </div>
  );
};

export default Trips;