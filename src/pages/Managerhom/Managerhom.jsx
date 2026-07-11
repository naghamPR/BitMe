// src/pages/Managerhom/Managerhom.jsx
import "./Managerhom.css";
import { useNavigate } from "react-router-dom";
import rating from "../../assets/rating.jpg";
import WebsiteStats from "../../components/WebsiteStats/WebsiteStats";

const Managerhom = () => {
  const navigate = useNavigate();

  const handleShowAllClick = () => {
    navigate("/show");
  };

  return (
    <div className="managerhom-page">
      <h1 className="managerhom-title">Welcome Manager! 😃</h1>

      <div className="managerhom-cards-wrapper">
        {/* <div className="managerhom-card">
          <div className="managerhom-card-content">
            <h2>Rating & Feedback</h2>
            <img src={rating} alt="Rating" className="managerhom-card-img" />
            <div className="managerhom-actions">
              <button
                className="managerhom-submit-button"
                onClick={() => navigate("/ViewFeedback")}
              >
                📝 View Details
              </button>
            </div>
          </div>
        </div> */}

        <div className="managerhom-card">
          <div className="managerhom-card-content">
            <h2>Manage Restaurants</h2>
            <img src={rating} alt="Manage" className="managerhom-card-img" />
            <div className="managerhom-actions">
              <button
                className="managerhom-submit-button"
                onClick={() => navigate("/Addresturant")}
              >
                ➕ Add Restaurant
              </button>
              {/* <button
                className="managerhom-submit-button"
                onClick={() => navigate("/TopUpWallet")}
              >
                ➕ TopUpWallet
              </button> */}
              <button
                className="managerhom-submit-button"
                onClick={handleShowAllClick}
              >
                📋 Show All Restaurants
              </button>
            </div>
          </div>
        </div>
        <WebsiteStats />
      </div>
    </div>
  );
};

export default Managerhom;
