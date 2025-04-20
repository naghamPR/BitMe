import { Link } from "react-router";
import "./homepage.css";

const HomePage = () => {
  return (
    <div className="body">
      <div className="container">
        <div className="image-container ">
          <img
            src="./imgs/waiter.jpg"
            alt="animated-image"
            className="animated-image"
          />
        </div>
        <div class="text-container">
          <h1>Your Title Here</h1>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
