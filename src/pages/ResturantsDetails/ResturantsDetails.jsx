// Resturants.jsx
import "./ResturantsDetails.css";
import { useParams } from "react-router-dom";
import { useState } from "react";

import resturant1 from "../../assets/resturant1.jpg"; // your image
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
import resturant1_1 from "../../assets/resturant1_1.jpg";
import resturant1_2 from "../../assets/resturant1_2.jpg";
import resturant1_3 from "../../assets/resturant1_3.jpg";
import resturant1_4 from "../../assets/resturant1_4.jpg";

const RestaurantDetails = () => {
  const [restaurantsData, setrestaurantsData] = useState([
    {
      id: 1,
      name: "Nona Cafe",
      title: "Fresh Italian Dishes",
      image: resturant1,
      secondimg: [resturant1_1, resturant1_2, resturant1_3, resturant1_4],
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
  const { id } = useParams(); // 👈 get id from URL
  const restaurant = restaurantsData.find((r) => r.id === parseInt(id)); // find restaurant

  if (!restaurant) {
    return <h2>Restaurant Not Found</h2>;
  }

  return (
    <div className="restaurants-pagedatails">
      <div
        className="restaurant-details-card"
        style={{ backgroundImage: `url(${restaurant.image})` }}
      >
        <div className="restaurant-details-overlay">
          <div className="restaurant-details-info">
            <h1>{restaurant.name}</h1>
            <p>{restaurant.title}</p>
            <p>
              Here you can add more details about the restaurant, menu,
              location, etc!
            </p>
            <div className="button-groupdetail ">
              <button className="action-btn">Reserve</button>
              <button className="action-btn">❤️</button>
              <button className="action-btn">Menu</button>
              <button className="action-btn">Bill</button>
            </div>
          </div>
        </div>
      </div>

      <div className="restaurant-gallery">
        <img src={resturant1_1} alt="Gallery 1" className="gallery-img" />
        <img src={resturant1_2} alt="Gallery 2" className="gallery-img" />
        <img src={resturant1_3} alt="Gallery 3" className="gallery-img" />
        <img src={resturant1_4} alt="Gallery 4" className="gallery-img" />
        <img src={resturant1_4} alt="Gallery 4" className="gallery-img" />
      </div>
    </div>
  );
};

export default RestaurantDetails;
