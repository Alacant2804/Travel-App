import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header.jsx';
import MainPhoto from './MainPhoto.jsx';
import AboutApp from './AboutApp.jsx';
import MapMain from './MapMain.jsx';
import Footer from './Footer.jsx';
import Trips from './Trips.jsx';
import TripDetail from './TripDetail.jsx';
import TravelHacks from './TravelHacks.jsx';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import NotFound from './NotFound.jsx';
import { useState } from 'react';


export default function App() {
  const [trips, setTrips] = useState([]);

  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <MainPhoto />
              <AboutApp />
              <MapMain />
            </>
          } />
          <Route path="/trips" element={<Trips trips={trips} setTrips={setTrips} />} />
          <Route path="/trips/:tripId" element={<TripDetail trips={trips} />} />
          <Route path="/travel-hacks" element={<TravelHacks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
