import './TravelHacks.css';
import travelLight from './assets/travel-light.jpg';
import budgetFlights from './assets/budget-flights.jpg';
import safeTravel from './assets/safe-travel.jpg';


const travelPostData = [
    {
        id: 1,
        title: "Packing Light",
        description: "Learn how to pack efficiently for a hassle-free journey.",
        image: travelLight,
    },
    {
        id: 2,
        title: "Budget Flights",
        description: "Find out how to score the best deals on flights.",
        image: budgetFlights,
    },
    {
        id: 3,
        title: "Safe Travel Tips",
        description: "Stay safe on the road with these essential tips.",
        image: safeTravel,
    },
];

export default function TravelHacks() {
    return (
        <div className="blog-layout">
            {travelPostData.map((post) => (
                <article className={`blog-post`} key={post.id}>
                    <img src={post.image} alt={post.title} className="post-image" />
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-description">{post.description}</p>
                </article>
            ))}
        </div>
    );
}
