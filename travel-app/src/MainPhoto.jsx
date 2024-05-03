import './MainPhoto.css'; 
import mainPhoto from './assets/main-photo1.jpg'

export default function MainPhoto() {
    return (
        <div className="main-photo-container">
            <img src={mainPhoto} alt="Main Scene" />
        </div>
    );
}