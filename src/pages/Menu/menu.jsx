import { useState } from "react";
import { Link } from "react-router-dom";
import "./menu.css";

const Menu = () => {
  const [menu, setmenu] = useState("");

  return (
    <div className="menu-page ">
      <div className="menu-card">
        <div className="background-image"></div>
        <div className="page-tittlemenu">
          <h3>hot drinks</h3>
        </div>
        <ul className="menu-list">
          <li className="menu-item">
            <span className="drink-name">Espresso</span>
            <span className="drink-price">$3.00</span>
          </li>
          <li className="menu-item">
            <span className="drink-name">Cappuccino</span>
            <span className="drink-price">$4.00</span>
          </li>
          <li className="menu-item">
            <span className="drink-name">Latte</span>
            <span className="drink-price">$4.50</span>
          </li>
        </ul>
        <div className="button-groupmenu">
          <button className="card-button">← </button>
          <button className="card-button">→</button>
        </div>
      </div>
    </div>
  );
};

export default Menu;
