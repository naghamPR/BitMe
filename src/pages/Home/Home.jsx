import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Home.css";
import waiter from "../../assets/waiter.jpg";
import chef from "../../assets/chef.jpg";
import offersstaf from "../../assets/offersstaf.jpg";

const slides = [
  {
    img: waiter,
    title: "Welcome to BiteBook",
    text: "Indulge in traditional dishes made with the freshest locally sourced ingredients.",
  },
  {
    img: chef,
    title: "Delicious Dining Awaits",
    text: "Experience gourmet meals in a cozy ambiance.",
  },
];

const offerSlide = {
  img: offersstaf,
  title: "Today's Special Offer",
  text: "Get 20% off on all reservations made before 6 PM!",
};

const HomePage = () => {
  const [index, setIndex] = useState(0);
  const [showOffer, setShowOffer] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (index < slides.length - 1) {
        setIndex((prev) => prev + 1);
      }
    }, 5000);
    return () => clearInterval(interval);
  }, [index]);

  const handleShowOffer = () => {
    setShowOffer(true);
  };

  const currentSlide = showOffer ? offerSlide : slides[index];

  return (
    <div className="body">
      <div className="main-content">
        <div className="container">
          <div className="image-container">
            <img
              src={currentSlide.img}
              alt={currentSlide.title}
              className="animated-image"
            />
          </div>
          <div className="text-container">
            <h1>{currentSlide.title}</h1>
            <p>{currentSlide.text}</p>

            <div className="button-group">
              <Link to="/Resturants">
                <button className="reserve-button">Make a Reservation</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
      <footer className="footer">
        &copy; {new Date().getFullYear()} Fjordsmaken. All rights reserved.
      </footer>
    </div>
  );
};

export default HomePage;
