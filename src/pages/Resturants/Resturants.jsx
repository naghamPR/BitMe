// Resturants.jsx
import "./Resturants.css";
import { useState } from "react";
import reactLogo from "../../assets/react.svg"; // Fixed import name
import { Link } from "react-router-dom";

import resturant1 from "../../assets/resturant1.jpg";
import resturant2 from "../../assets/resturant2.jpg";
import resturant3 from "../../assets/resturant3.jpg";
import resturant4 from "../../assets/resturant4.jpg";
import resturant5 from "../../assets/resturant5.jpg";
import resturant6 from "../../assets/resturant6.jpg";
import resturant7 from "../../assets/resturant7.jpg";
import resturant8 from "../../assets/resturant8.jpg";
import resturant9 from "../../assets/resturant9.jpg";
import resturant10 from "../../assets/resturant10.jpg";
import resturant11 from "../../assets/resturant11.jpg";
import resturant12 from "../../assets/resturant12.jpg";
import resturant13 from "../../assets/resturant13.jpg";

const Resturants = () => {
  const [data, setData] = useState([
    {
      id: 1,
      name: "Nona Cafe",
      title: "Fresh Italian Dishes",
      image: resturant1,
    },
    {
      id: 2,
      name: "Malak Lounge",
      title: "Luxury Arabian Meals",
      image: resturant2,
    },
    {
      id: 3,
      name: "Sushi World",
      title: "Authentic Japanese Sushi",
      image: resturant3,
    },
    {
      id: 4,
      name: "Burger Zone",
      title: "American Burgers & Fries",
      image: resturant4,
    },
    {
      id: 5,
      name: "Sweet Treats",
      title: "Desserts & Ice Cream",
      image: resturant5,
    },
    {
      id: 6,
      name: "Tasty Bites",
      title: "Quick Snacks & Meals",
      image: resturant6,
    },
    {
      id: 7,
      name: "Golden Grill",
      title: "Grilled Delicacies",
      image: resturant7,
    },
    {
      id: 8,
      name: "Ocean Delights",
      title: "Seafood Specialties",
      image: resturant8,
    },
    {
      id: 9,
      name: "Veggie Haven",
      title: "Vegan and Healthy Meals",
      image: resturant9,
    },
    {
      id: 10,
      name: "Coffee Corner",
      title: "Specialty Coffees",
      image: resturant10,
    },
    {
      id: 11,
      name: "Cake House",
      title: "Cakes and Pastries",
      image: resturant11,
    },
    {
      id: 12,
      name: "BBQ Nation",
      title: "Smoky BBQ Treats",
      image: resturant12,
    },
    { id: 13, name: "Pasta Point", title: "Italian Pasta", image: resturant13 },
  ]);

  return (
    <div className="restaurants-page">
      <nav className="second-navbar">
        <div className="search-container">
          <label htmlFor="search">Search for restaurant : </label>
          <input type="text" id="search" placeholder="search it ..." />
          🔎
        </div>
      </nav>
      <div className="restaurants-grid">
        {data.map((restaurant) => (
          <div className="restaurant-card">
            <Link
              to={`/Resturants/${restaurant.id}`}
              key={restaurant.id}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              <img
                src={restaurant.image}
                alt={restaurant.name}
                className="restaurant-image"
              />
              <h2>{restaurant.name}</h2>
              <p>{restaurant.title}</p>
              <button className="buttons">show</button>
              <button className="buttons">reserve</button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Resturants;
