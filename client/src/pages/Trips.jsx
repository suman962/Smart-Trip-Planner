import Nav from '../components/Nav';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Trips = () => {
  const [tripIdPresent, setTripIdPresent] = useState(false);
  const [trip, setTrip] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (!token || !expiry || new Date(expiry) < new Date()) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiry');
      navigate('/login');
    }
  }, []);

  const tripId = new URLSearchParams(window.location.search).get('tripId');
  useEffect(() => {
    if (!tripId) {
      setTripIdPresent(false);
    } else {
      setTripIdPresent(true);
    }
  }, [tripId]);

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
      if (!tripIdPresent) {
        const fetchTripsResponse = await fetch(`http://localhost:3400/api/db/gettrips?email=${email}`);
        const fetchTripsData = await fetchTripsResponse.json();
        if (fetchTripsData.error) {
          console.error("Fetch trips failed:", fetchTripsData.error);
          return;
        }
        setTrip(fetchTripsData);
      } else {
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
      }
    };

    fetchTrip();
  }, []);

  return (
    <div 
      className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{ backgroundImage: "url('./assets/trips.png')" }}
    >
      <Nav currentPage='Trips'/>
      <div>
        {
          tripIdPresent ? (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl font-bold text-white mb-4">{trip.name}</h1>
              <img src={trip.image} alt={trip.name} className="w-1/2 rounded-lg shadow-lg mb-4" />
              <p className="text-lg text-white mb-2">Best Time: {trip.bestTime}</p>
              <p className="text-md text-white">Place ID: {trip.placeId}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h1 className="text-4xl font-bold text-white my-4 md:mt-8 text-shadow-lg/75">Your Trips</h1>
              {
                trip && trip.length > 0 ? (
                  <ul className="list-disc text-white">
                    {trip.map((t) => (
                      <li key={t._id} className="mb-2">
                        <Link
                          to={`/trips?tripId=${t._id}`} 
                          className="text-blue-400 hover:underline"
                        >
                          {t.name}
                        </Link>
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