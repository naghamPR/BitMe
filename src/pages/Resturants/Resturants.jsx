// Resturants.jsx
import "./Resturants.css";
import { useState } from "react";
import reactLogo from "../../assets/react.svg"; // Fixed import name
import { Link } from "react-router-dom";

const Resturants = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Nona Cafe",
      title: "Fresh Italian Dishes",
    },
    {
      id: 2,
      name: "Malak Lounge",
      title: "Luxury Arabian Meals",
    },
    {
      id: 3,
      name: "Sushi World",
      title: "Authentic Japanese Sushi",
    },
    {
      id: 4,
      name: "Burger Zone",
      title: "American Burgers & Fries",
    },
    {
      id: 5,
      name: "Sweet Treats",
      title: "Desserts & Ice Cream",
    },
  ]);

  return (
    <div className="restaurants-page">
      <h1 className="page-title">Restaurants</h1>

      <div className="restaurants-grid">
        {data.map((d) => (
          <Link
            to={`/Resturants/:${d.id}`}
            key={d.id}
            className="restaurant-card"
          >
            <img src={reactLogo} alt={d.name} className="restaurant-image" />
            <h2>{d.name}</h2>
            <p>{d.title}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Resturants;
