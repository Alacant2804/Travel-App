import './TravelHacks.css';
import travelLight from './assets/travel-light.jpg';
import budgetFlights from './assets/budget-flights.jpg';
import safeTravel from './assets/safe-travel.jpg';
import travelPro from './assets/travel-pro.jpg';
import culture from './assets/culture.jpg';
import international from './assets/international.jpg';


const travelPostData = [
    {
        id: 1,
        title: "Travel Smart: Essential Tips on How to Reduce Your Baggage for a Hassle-Free Journey",
        image: travelLight,
    },
    {
        id: 2,
        title: "Fly on a Budget: Insider Tips for Finding Affordable Flights Without Compromising Quality",
        image: budgetFlights,
    },
    {
        id: 3,
        title: "Travel Confidently: Essential Safe Travel Tips for a Secure and Worry-Free Adventure",
        image: safeTravel,
    },
    {
        id: 4,
        title: "Local Experiences: How to Immerse Yourself in Authentic Culture When Traveling",
        image: culture,
    },
    {
        id: 5,
        title: "Travel Like a Pro: Efficient Packing Tips to Maximize Your Carry-On Space",
        image: travelPro,
    },
    {
        id: 6,
        title: "Stay Connected: Tips for Navigating International Communication and Internet Access",
        image: international,
    },
];

export default function TravelHacks() {
    return (
      <>
        <h2 className='blog-header'>Blog Posts</h2>
        <div className="blog-layout">
            {travelPostData.map((post) => (
                <article className='blog-post' key={post.id}>
                    <img src={post.image} alt={post.title} className="post-image" />
                    <h2 className="post-title">{post.title}</h2>
                    <p className="post-description">{post.description}</p>
                    <button className='post-button'>Read more</button>
                </article>
            ))}
        </div>
      </>
    );
}
