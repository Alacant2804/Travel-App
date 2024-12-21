import { useState } from "react";
import "./TravelHacks.css";
import travelLight from "../../assets/travel-light.jpg";
import budgetFlights from "../../assets/budget-flights.jpg";
import safeTravel from "../../assets/safe-travel.jpg";
import travelPro from "../../assets/travel-pro.jpg";
import culture from "../../assets/culture.jpg";
import international from "../../assets/international.jpg";
import Title from "../common/Title";

const travelPostData = [
  {
    id: 1,
    title: "Tips on How to Reduce Your Baggage",
    image: travelLight,
    description:
      "Packing for a trip can be daunting, especially when you want to avoid excess baggage fees and the hassle of lugging around heavy suitcases. This guide will show you how to pack efficiently and effectively. Learn to prioritize essential items, use space-saving packing techniques, and choose versatile clothing. Whether you're traveling for a weekend getaway or a month-long adventure, these tips will help you travel light and stress-free.",
  },
  {
    id: 2,
    title: "Insider Tips for Finding Affordable Flights",
    image: budgetFlights,
    description:
      "Dreaming of a vacation but worried about the cost of flights? This post is your ultimate guide to finding affordable air travel. From leveraging fare comparison websites to understanding the best times to book, we'll cover all the strategies you need to save money on flights. Discover tips on setting fare alerts, using airline reward programs, and even finding hidden city ticketing opportunities. Your dream destination is closer than you think!",
  },
  {
    id: 3,
    title: "Essential Safe Travel Tips for a Secure Adventure",
    image: safeTravel,
    description:
      "Safety should always be a priority when you're on the road. In this article, we'll provide you with essential safety tips to ensure a secure and enjoyable adventure. Learn how to keep your belongings safe, recognize common travel scams, and stay healthy while traveling. We'll also cover important steps like registering with your embassy and having emergency contacts handy. With these tips, you can focus on creating unforgettable memories without worry.",
  },
  {
    id: 4,
    title: "How to Immerse Yourself in Authentic Culture When Traveling",
    image: culture,
    description:
      "Traveling is about more than just seeing new places; it's about experiencing new cultures. This post will guide you on how to truly immerse yourself in the local culture of your destination. From learning basic phrases in the local language to participating in cultural festivals and events, we'll show you how to go beyond the tourist traps. Connect with locals, try traditional foods, and understand cultural customs to enrich your travel experience.",
  },
  {
    id: 5,
    title: "Efficient Packing Tips to Maximize Your Carry-On Space",
    image: travelPro,
    description:
      "Packing can be a challenging aspect of travel, but with the right tips, you can make the most of your carry-on space. This article provides practical advice on how to pack efficiently. Discover how to roll your clothes to save space, use packing cubes for better organization, and select multi-purpose items that reduce the need for additional luggage. Say goodbye to checked bag fees and hello to more convenience and freedom on your travels.",
  },
  {
    id: 6,
    title: "Navigating International Communication and Internet Access",
    image: international,
    description:
      "Staying connected while traveling abroad is crucial for both convenience and safety. This post will explore the best options for international communication and internet access. Learn about global SIM cards, portable Wi-Fi devices, and reliable communication apps. We'll also cover tips on avoiding high roaming charges and finding free Wi-Fi hotspots. Whether you're traveling for business or leisure, these tips will ensure you can stay in touch with loved ones and navigate your travels with ease.",
  },
];

function truncateText(text, maxLength) {
  if (text.length <= maxLength) {
    return text;
  }
  return text.substring(0, maxLength) + "...";
}

export default function TravelHacks() {
  const [modalContent, setModalContent] = useState(null);

  const openModal = (post) => {
    setModalContent(post);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  return (
    <main className="travel-hacks-container">
      <Title title="Travel Hacks | Travel App" />
      <header>
        <h2 className="blog-header">Blog Posts</h2>
      </header>
      <section className="blog-layout">
        {travelPostData.map((post) => (
          <article className="blog-post" key={post.id}>
            <img src={post.image} alt={post.title} className="post-image" />
            <h3 className="post-title">{post.title}</h3>
            <p className="post-description">
              {truncateText(post.description, 100)}
            </p>
            <button className="post-button" onClick={() => openModal(post)}>
              Read more
            </button>
          </article>
        ))}
      </section>
      {modalContent && (
        <div className="modal show">
          <div className="modal-content">
            <button className="close" onClick={closeModal} aria-label="Close">
              &times;
            </button>
            <img
              src={modalContent.image}
              alt={modalContent.title}
              className="modal-image"
            />
            <h3 className="modal-title">{modalContent.title}</h3>
            <p>{modalContent.description}</p>
          </div>
        </div>
      )}
    </main>
  );
}
