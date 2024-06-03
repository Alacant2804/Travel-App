import { useState } from 'react';
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
        title: "Tips on How to Reduce Your Baggage",
        image: travelLight,
        description: "Detailed description of the article goes here..."
    },
    {
        id: 2,
        title: "Insider Tips for Finding Affordable Flights",
        image: budgetFlights,
        description: "Detailed description of the article goes here..."
    },
    {
        id: 3,
        title: "Essential Safe Travel Tips for a Secure Adventure",
        image: safeTravel,
        description: "Detailed description of the article goes here..."
    },
    {
        id: 4,
        title: "How to Immerse Yourself in Authentic Culture When Traveling",
        image: culture,
        description: "Detailed description of the article goes here..."
    },
    {
        id: 5,
        title: "Efficient Packing Tips to Maximize Your Carry-On Space",
        image: travelPro,
        description: "Detailed description of the article goes here..."
    },
    {
        id: 6,
        title: "Navigating International Communication and Internet Access",
        image: international,
        description: "Detailed description of the article goes here..."
    },
];

export default function TravelHacks() {
    const [modalContent, setModalContent] = useState(null);

    const openModal = (post) => {
        console.log("Opening modal with post:", post); // Debug log
        setModalContent(post);
    };

    const closeModal = () => {
        setModalContent(null);
    };

    return (
        <>
            <h2 className='blog-header'>Blog Posts</h2>
            <div className="blog-layout">
                {travelPostData.map((post) => (
                    <article className='blog-post' key={post.id}>
                        <img src={post.image} alt={post.title} className="post-image" />
                        <h2 className="post-title">{post.title}</h2>
                        <p className='post-description'>{post.description}</p>
                        <button className='post-button' onClick={() => openModal(post)}>Read more</button>
                    </article>
                ))}
            </div>
            {modalContent && (
                <div className={`modal ${modalContent ? 'show' : ''}`}>
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>{modalContent.title}</h2>
                        <p>{modalContent.description}</p>
                    </div>
                </div>
            )}
        </>
    );
}
