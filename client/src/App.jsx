import { BrowserRouter, Routes, Route } from "react-router-dom";
import {
  Home,
  Login,
  Signup,
  Search,
  Trip,
  Trips
} from "./pages";

function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/search" element={<Search />} />
          <Route path="/trip" element={<Trip />} />
          <Route path="/trips" element={<Trips />} />
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App;
