import { Link } from "react-router-dom";

import mainPhoto from "../../assets/main-photo1.jpg";
import "./MainPhoto.css";

export default function MainPhoto() {
  return (
    <div className="main-photo-container">
      <img src={mainPhoto} alt="Main Scene" />
      <div className="main-photo-text">
        <h2>Make the Best of Your Trip!</h2>
        <p>
          Discover new adventures, explore stunning destinations, and create
          memories that will last a lifetime.
        </p>
        <Link to="/trips">
          <button className="trip-button">Create Your Trip</button>
        </Link>
      </div>
    </div>
  );
}
