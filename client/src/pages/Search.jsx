import Nav from '../components/Nav';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';


const Search = () => {
  const navigate = useNavigate();

  const [inputValue, setInputValue] = useState('');
  const [places, setPlaces] = useState([]);
  const [showPlaces, setShowPlaces] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState('');
  const [isValidSelection, setIsValidSelection] = useState(false);
  const [debounceTimer, setDebounceTimer] = useState(null);
  
  useEffect(() => {
    const token = localStorage.getItem('token');
    const expiry = localStorage.getItem('expiry');
    if (!token || !expiry || new Date(expiry) < new Date()) {
      localStorage.removeItem('token');
      localStorage.removeItem('expiry');
      navigate('/login');
    }

  }, []);

  const fetchPlaces = async (input) => {
    if (input.length < 2) return;

    try {
      const response = await fetch(`http://localhost:3400/api/autocomplete?input=${input}`);
      const placesFromApi = await response.json();
      setPlaces(placesFromApi);
      setShowPlaces(true);
    } catch (error) {
      console.error('Autocomplete error:', error);
      setPlaces([]);
      setShowPlaces(false);
    }
  };

  const handleInputChange = (event) => {
    const value = event.target.value;
    setInputValue(value);
    setIsValidSelection(false); 
    
    if (debounceTimer) clearTimeout(debounceTimer);
    
    const timer = setTimeout(() => {
      if (value.trim()) {
        fetchPlaces(value);
      } else {
        setPlaces([]);
        setShowPlaces(false);
      }
    }, 300); 
    
    setDebounceTimer(timer);
  };

  const handlePlacesClick = (place) => {
    setInputValue(place.name);
    setSelectedPlace(place);
    setIsValidSelection(true);
    setShowPlaces(false);
    setPlaces([]);
  };

  const placeSubmit = (event) => {
    event.preventDefault();
    setIsValidSelection(false);
    const placeId = selectedPlace.placeId;
    navigate(`/trip?place=${placeId}`);
  }

  return (
    <div 
      className="h-screen bg-cover bg-center bg-no-repeat bg-fixed flex flex-col"
      style={{ backgroundImage: "url('./assets/search.png')" }}
    >
      <Nav currentPage='Search' />

      <main className="flex-1 flex items-center justify-center -mt-60">
        <div className='flex flex-col items-center'>
          <h1 className="text-3xl md:text-4xl font-bold text-amber-50 mb-4 text-center">Search for Trips</h1>
          <p className="text-md md:text-lg text-sky-100 mb-8 text-center">Find your next destination with ease</p>
          
          <form 
              className="relative flex justify-center bg-slate-700/60 rounded-lg p-4 shadow-lg"
              onSubmit={placeSubmit}
            >
            <input 
              type="text" 
              placeholder="Enter a place..." 
              value={inputValue}
              onChange={handleInputChange}
              className="border-2 border-gray-300 rounded-lg p-2 w-60 md:w-80 lg:w-120 text-white"
            />
            <button 
              type="submit"
              disabled={!isValidSelection}
              className="ml-2 bg-sky-500 text-white rounded-lg px-4 py-4 hover:bg-sky-600"
            >
              Search
            </button>
            {showPlaces && places.length > 0 && (
              <div className="absolute top-full left-0 right-0 rounded-lg mt-1 max-h-60 overflow-y-auto z-10">
                {places.map((place, index) => (
                  <div
                    key={index}
                    onClick={() => handlePlacesClick(place)}
                    className="px-4 py-2 hover:bg-gray-100 text-sky-50 hover:text-sky-950 hover:font-bold bg-slate-700/60"
                  >
                    {place.name}
                  </div>
                ))}
              </div>
            )}
          </form>
        </div>
      </main>
      
    </div>
  )
}

export default Search;