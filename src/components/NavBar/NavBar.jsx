import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to="/">BiteMe</Link>font-size: 18px;
      </div>

      <div className="navbar-links">
        <Link to="/">Home</Link>
        <Link to="/Resturants">Restaurants</Link>
        <Link to="/Login">Login</Link>
      </div>
    </nav>
  );
};

export default NavBar;
