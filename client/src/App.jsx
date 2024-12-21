import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TripsProvider } from "./context/TripsContext.jsx";
import { ToastContainer } from "react-toastify";
import Header from "./components/mainPageComponents/Header.jsx";
import MainPhoto from "./components/mainPageComponents/MainPhoto.jsx";
import AboutApp from "./components/mainPageComponents/AboutApp.jsx";
import BlockMain from "./components/mainPageComponents/BlockMain.jsx";
import Footer from "./components/mainPageComponents/Footer.jsx";
import Trips from "./components/tripDetailsComponents/Trips.jsx";
import TripDetail from "./components/tripDetailsComponents/TripDetail.jsx";
import TravelHacks from "./components/blogPageComponents/TravelHacks.jsx";
import Login from "./components/authenticationComponents/Login.jsx";
import SignUp from "./components/authenticationComponents/SignUp.jsx";
import PrivacyPolicy from "./components/mainPageComponents/PrivacyPolicy.jsx";
import TermsOfConditions from "./components/mainPageComponents/TermsOfConditions.jsx";
import Title from "./components/common/Title.jsx";
import NotFound from "./styles/notFound/NotFound.jsx";
import "leaflet/dist/leaflet.css";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TripsProvider>
          <div className="App">
            <Header />
            <Routes>
              <Route
                path="/"
                element={
                  <>
                    <Title title="Travel App" />
                    <MainPhoto />
                    <AboutApp />
                    <BlockMain />
                  </>
                }
              />
              <Route path="/trips" element={<Trips />} />
              <Route path="/trips/:tripId" element={<TripDetail />} />
              <Route path="/travel-hacks" element={<TravelHacks />} />
              <Route path="/login" element={<Login />} />
              <Route path="/sign-up" element={<SignUp />} />
              <Route path="/privacy-policy" element={<PrivacyPolicy />} />
              <Route
                path="/terms-of-conditions"
                element={<TermsOfConditions />}
              />
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
