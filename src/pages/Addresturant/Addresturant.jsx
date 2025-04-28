import "./Addresturant.css";
import { useState } from "react";

const Addresturant = () => {
  const [add, setadd] = useState();
  return (
    <div className="add-resturant-page">
      <div className="input-card">
        <div className="add-card-img"></div> {/* image in background */}
        <div className="card-content">
          {" "}
          {/* content on top */}
          <div className="card-title">Add Restaurant</div>
          <input
            className="input-field"
            type="text"
            placeholder="Restaurant Name"
          />
          <input className="input-field" type="text" placeholder="Location" />
          <input
            className="input-field"
            type="text"
            placeholder="Cuisine Type"
          />
          <button className="submit-button">Add</button>
        </div>
      </div>
    </div>
  );
};

export default Addresturant;
