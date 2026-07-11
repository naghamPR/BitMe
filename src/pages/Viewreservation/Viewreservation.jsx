import "./Viewreservation.css";
import { useState } from "react";
import resturant1 from "../../assets/resturant1.jpg";
import resturant2 from "../../assets/resturant2.jpg";

const Viewreservation = () => {
  const [view, setview] = useState([
    {
      id: 1,
      name: "Reserved by Nagham Akeed",
      title: "Fresh Italian Dishes",
      image: resturant1,
      date: "2024-04-02",
    },
    {
      id: 2,
      name: "Reserved by Leen Al Jeroudi",
      title: "Nagham",
      image: resturant2,
      date: "2025-05-08",
    },
    {
      id: 3,
      name: "Reserved by Rama",
      title: "Nagham",
      image: resturant2,
      date: "2025-05-08",
    },
  ]);

  return (
    <div className="view-reservation-page">
      <h2 className="view-restaurant-title">Your Reservations! 😃</h2>
      <div className="restaurants-grid">
        <div className="view-reservation-cards-wrapper">
          {view.map((r) => (
            <div className="view-reservation-input-card" key={r.id}>
              <img
                src={r.image}
                alt={r.name}
                className="view-reservation-card-img"
              />
              <div className="view-reservation-card-content">
                <div className="glass-label">
                  <h3>{r.name}</h3>
                  <p>Reservation Date: {r.date}</p>
                  <button className="view-reservation-submit-button">
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Viewreservation;
