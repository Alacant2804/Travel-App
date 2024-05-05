import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Header.jsx';
import MainPhoto from './MainPhoto.jsx';
import AboutApp from './AboutApp.jsx';
import Footer from './Footer.jsx';
import Trips from './Trips.jsx';
import TravelHacks from './TravelHacks.jsx';
import Login from './Login.jsx';
import SignUp from './SignUp.jsx';

export default function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={
            <>
              <MainPhoto />
              <AboutApp />
            </>
          } />
          <Route path="/trips" element={<Trips />} />
          <Route path="/travel-hacks" element={<TravelHacks />} />
          <Route path="/login" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
