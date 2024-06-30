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
import PrivacyPolicy from './PrivacyPolicy.jsx';
import TermsOfConditions from './TermsOfConditions.jsx';
import Title from './Title.jsx';
import NotFound from './NotFound.jsx';
import 'leaflet/dist/leaflet.css';
import 'react-toastify/dist/ReactToastify.css'


export default function App() {

  return (
    <BrowserRouter>
      <AuthProvider>
        <TripsProvider>
        <div className="App">
          <Header />
          <Routes>
            <Route path="/" element={
              <>
                <Title title="Travel App" />
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
            <Route path="/privacy-policy" element={<PrivacyPolicy />} />
            <Route path="/terms-of-conditions" element={<TermsOfConditions />} />
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