import "./Home.css";
import waiter from "../../assets/waiter.jpg"; // adjust path if needed

const Home = () => {
  return (
    <div className="home">
      <img src={waiter} alt="Top Left" className="corner-image top-left" />
      <img
        src={waiter}
        alt="Bottom Right"
        className="corner-image bottom-right"
      />

      <div className="home-content">
        <h1 className="slide-in">Welcome to BitMe</h1>
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
