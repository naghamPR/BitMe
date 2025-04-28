import "./Home.css";
import waiter from "../../assets/waiter.jpg"; // adjust path if needed
import chef from "../../assets/chef.jpg";

const Home = () => {
  return (
    <div className="home">
      <img src={waiter} alt="Top Left" className="corner-image top-left" />

      <img
        src={chef}
        alt="Bottom Right"
        className="corner-image bottom-right"
      />

      <div className="corner-text top-left-text">
        <p>Welcome to BiteBook, your best choice for smart dining solutions!</p>
      </div>

      {/* ➔ New Paragraph at Bottom Right */}
      <div className="corner-text bottom-right-text">
        <p>
          Explore our platform for the finest restaurants, top chefs, and the
          best dining experience!
        </p>
      </div>

      <div className="home-content">
        <h1 className="slide-in">Welcome to BiteBook</h1>
        <p className="fade-in">Your gateway to smart, modern web solutions.</p>
        <button className="home-button fade-in">Get Started</button>
      </div>

      <footer className="footer">
        <p>© 2025 BitMe. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default Home;
