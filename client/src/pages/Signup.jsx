import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';
import Nav from '../components/Nav';
import { LoginOverlayClouds, LoginOverlayAirplane } from '../components/LoginOverlay';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const [error, setError] = useState("");

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      const response = await fetch('http://localhost:3400/api/db/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('expiry', data.expiry);
        navigate('/');
      } else {
        setError(data.error || "Signup failed");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-200 flex flex-col">
      <Nav className="bg-white" currentPage='Sign Up'/>
      <LoginOverlayClouds />
      
      <div className="flex-1 flex items-center justify-center">
        <div className='bg-amber-50 rounded-lg p-10 shadow-lg relative'>
          <LoginOverlayAirplane />
          <h1 className='text-3xl font-bold text-gray-400 mb-4 text-center'>Sign Up</h1>
          <form onSubmit={handleSignup}>
            <div>
              <div className=''>
                {error && <p className="error text-sm text-red-400 -mt-3 text-center">{error}</p>}
              </div>
              <div className="space-y-4 w-65 md:w-80 lg:w-96">
                <div>
                  <label htmlFor="email" className="block font-medium mb-1">Email</label>
                  <input
                    type="email"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className='border border-gray-300 rounded-lg p-2 w-full'
                  />
                </div>
                
                <div>
                  <label htmlFor="password" className="block font-medium mb-1">Password</label>
                  <input
                    type="password"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className='border border-gray-300 rounded-lg p-2 w-full'
                  />
                </div>

                <div>
                  <label htmlFor="confirmPassword" className="block font-medium mb-1">Confirm Password</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                    className='border border-gray-300 rounded-lg p-2 w-full'
                  />
                </div>
              </div>
              <div className='text-sm text-gray-500 mt-3'>
                Already have an account? <Link to="/login" className='text-cyan-500 hover:underline'>Login</Link>
              </div>
              <div className='mt-4 text-center'>
                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded-lg">
                  Sign Up
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Signup;