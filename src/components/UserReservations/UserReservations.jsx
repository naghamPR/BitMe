import React, { useEffect, useState } from "react";
import "./UserReservations.css";
import { getUserReservations } from "../../actions/reservationsActions";
import axiosClient from "../../../axios-client";

const UserReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReservations = async () => {
      try {
        const response = await axiosClient.get("/userReservations");
        setReservations(response.data.data);
      } catch (err) {
        setError("Failed to load reservations.");
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []); // Empty array to run effect only once on component mount

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Your Reservations</h1>
      <div>
        {reservations.length === 0 ? (
          <p>No reservations found</p>
        ) : (
          reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <p>Table: {reservation.name}</p>
              <p>Start Time: {reservation.reserve_from}</p>
              <p>Tail Time: {reservation.reserve_until}</p>
              <p>status: {reservation.status}</p>
              <p>number_of_persons: {reservation.number_of_persons}</p>
              {/* Render other reservation details here */}
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default UserReservations;
