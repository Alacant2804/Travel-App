import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { TripsProvider } from './TripsContext.jsx';
import { ToastContainer } from 'react-toastify';
import Header from './Header.jsx';
import MainPhoto from './MainPhoto.jsx';
import AboutApp from './AboutApp.jsx';
import BlockMain from './BlockMain.jsx';
import Footer from './Footer.jsx';
import Trips from './Trips.jsx';
import TripDetail from './TripDetail.jsx';
import TravelHacks from './TravelHacks.jsx';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';
import NotFound from './NotFound.jsx';
import { useState, useEffect } from 'react';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css'


export default function App() {
  const [trips, setTrips] = useState([]);

  useEffect(() => {
    const storedTrips = localStorage.getItem('trips');
    if (storedTrips) {
        setTrips(JSON.parse(storedTrips));
        console.log(storedTrips)
    }
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <TripsProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <MainPhoto />
                <AboutApp />
                <BlockMain />
              </>
            } />
            <Route path="/trips" element={<Trips />} />
            <Route path="/trips/:tripId" element={<TripDetail />} />
            <Route path="/travel-hacks" element={<TravelHacks />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <ToastContainer
            position="bottom-right"
            autoClose={3000}
            hideProgressBar
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            pauseOnHover
          />
        </div>
        </TripsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}