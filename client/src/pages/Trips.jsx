import Nav from '../components/nav';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
      if (!tripIdPresent) {
        url = "" //incomplete
      }
      const response = await fetch('http://localhost:3400/api/gettrips');
      const data = await response.json();
      setTrips(data);
    };

    fetchTrips();
  }, []);

  return (
    <div 
      className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{ backgroundImage: "url('./assets/trips.png')" }}
    >
      <Nav currentPage='Trips'/>
      <h1>Your Trips</h1>

    </div>
  );
};

export default Trips;