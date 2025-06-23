import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import Nav from '../components/nav';


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('Login Successful!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-cyan-200 flex flex-col">
      <Nav className="bg-white" currentPage='Login'/>
      <div className="flex-1 flex items-center justify-center">
        <div className='bg-amber-50 rounded-lg p-10 shadow-lg'>
          <h1 className='text-3xl font-bold text-gray-400 mb-4 text-center'>Login</h1>
          <form onSubmit={handleLogin}>
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
              </div>
              <div className='mt-4 text-center'>
                <button type="submit" className="bg-cyan-500 text-white px-4 py-2 rounded-lg">
                  Login
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default Login;