import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../actions/authActions"; // Adjust path as needed
import "./Logout.css"; // Assuming this CSS provides a basic loading message style

const Logout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await dispatch(logout());


        navigate('/')
        window.location.reload();
      } catch (error) {
        window.location.reload();
      }
    };

    performLogout();
  }, [dispatch, navigate]);

  return (
    <div className="logout-page">
      <h2>Logging you out...</h2>
      <p>Please wait a moment.</p>
    </div>
  );
};

export default Logout;