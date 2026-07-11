import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import "./ReservationStatusPoll.css";
const ReservationStatusPoll = () => {
  const [notification, setNotification] = useState(null);

  const checkReservationStatus = async () => {
    try {
      const response = await axiosClient.get("/reservation-status");
      if (response.data.status === "waitlist") {
        setNotification("You have been added to the waitlist.");
      } else if (response.data.status === "success") {
        setNotification("Reservation successful!");
      }
    } catch (error) {
      setNotification("Failed to fetch reservation status.");
    }
  };

  useEffect(() => {
    // Poll every 10 seconds (adjust interval as needed)
    const interval = setInterval(checkReservationStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div>
      {notification && <div className="notification">{notification}</div>}
    </div>
  );
};

export default ReservationStatusPoll;
