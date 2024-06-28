import './BlockMain.css';
import { FaMapMarkedAlt, FaRegListAlt, FaRoute } from 'react-icons/fa';

export default function MapMain() {
    const steps = [
        {
            title: "Create Your Trip",
            description: "Begin by providing essential details about your trip, such as the trip name, destination, travel dates to help define the scope of your journey.",
            icon: <FaMapMarkedAlt className="step-icon" />
        },
        {
            title: "Plan Your Trip",
            description: "Organize your travel plans by listing key experiences and activities you'd like to enjoy. This can include landmarks to visit, local dishes to taste, and leisure activities to try, ensuring your itinerary is tailored to your interests.",
            icon: <FaRegListAlt className="step-icon" />
        },
        {
            title: "Plan Your Trip",
            description: "Utilize our comprehensive tools to plan your trip efficiently. Manage your budget with our budget planner, and keep track of flight and car rental details all in one place. This ensures a smooth and well-organized travel experience.",
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
