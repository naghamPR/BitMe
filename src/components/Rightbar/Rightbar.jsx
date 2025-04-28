import { useState } from "react";
import "./Rightbar.css";
import { Link } from "react-router-dom";

const Rightbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <div className="rightbar-container">
      <button className="toggle-button" onClick={() => setOpen(!open)}>
        ☰ {/* menu icon */}
      </button>

      {open && (
        <div className="rightbar">
          <Link to="/profile">👤 Profile</Link>
          <Link to="/settings">⚙️ Settings</Link>
          <Link to="/logout">🚪 Logout</Link>
          <Link to="/logout">❤️ favorite</Link>
          <Link to="/logout">🌐 language</Link>
        </div>
      )}
    </div>
  );
};

export default Rightbar;
