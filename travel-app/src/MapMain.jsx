// MapMain.jsx
import './MapMain.css';
import { FaMapMarkedAlt, FaRegListAlt, FaRoute } from 'react-icons/fa';

export default function MapMain() {
    const steps = [
        {
            title: "Create Your Trip",
            description: "Begin by providing essential details about your trip, such as the trip name, destination, travel dates, and any other important information to help define the scope of your journey.",
            icon: <FaMapMarkedAlt className="step-icon" />
        },
        {
            title: "Plan Your Trip",
            description: "Organize your travel plans by listing key experiences and activities you'd like to enjoy. This can include landmarks to visit, local dishes to taste, and leisure activities to try, ensuring your itinerary is tailored to your interests.",
            icon: <FaRegListAlt className="step-icon" />
        },
        {
            title: "Select on the Map",
            description: "Use the interactive map to mark each point of interest, stopover, or location that you'd like to visit. This will visually map out your trip, giving you a comprehensive overview of your travel plans and making it easier to adjust your route.",
            icon: <FaRoute className="step-icon" />
        }
    ];

    return (
        <>
        <div className="hr-container">
            <hr className="custom-hr" />
        </div>
        <h2 className='headerSecond'>How to plan the trip?</h2>
        <div className="map-main">
            <ol className="steps-list">
                {steps.map((step, index) => (
                    <li className="step" key={index}>
                        {step.icon}
                        <div className="step-content">
                            <h3>{step.title}</h3>
                            <p>{step.description}</p>
                        </div>
                    </li>
                ))}
            </ol>
        </div>
        </>
    );
}
