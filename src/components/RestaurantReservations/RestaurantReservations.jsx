import React, { useEffect, useState } from "react";
import "./RestaurantReservations.css";
// import { getReservationsForRestaurant } from "../../actions/reservationsActions"; // This import is not used in the provided code
import axiosClient from "../../../axios-client"; // Assuming you have this axiosClient set up.
import {
  Loader,
  AlertCircle,
  Users,
  Clock,
  CheckCircle,
  Calendar,
  Utensils,
  User,
  Phone,
  Mail,
  FileText,
} from "lucide-react"; // Import more icons

const RestaurantReservations = () => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [finishLoading, setFinishLoading] = useState({}); // To track loading state per reservation
  const [finishMessage, setFinishMessage] = useState({}); // To show success/error message per reservation

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axiosClient.get("/getReservationRes"); // Assuming this fetches current restaurant's reservations
        setReservations(response.data.data); // Assuming response structure is { data: [...] }
      } catch (err) {
        setError("Failed to load restaurant reservations. Please try again.");
        console.error("Error fetching reservations:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, []);

  const handleFinishReservation = async (reservationId) => {
    setFinishLoading((prev) => ({ ...prev, [reservationId]: true }));
    setFinishMessage((prev) => ({ ...prev, [reservationId]: null }));

    try {
      const response = await axiosClient.post(
        `/finish-reservation/${reservationId}`
      );

      if (response.data.success) {
        setFinishMessage((prev) => ({
          ...prev,
          [reservationId]: {
            type: "success",
            text: response.data.message || "Reservation finished!",
          },
        }));
        // Update the reservation status locally or remove it if "finished" means removal
        setReservations(
          (prevReservations) =>
            prevReservations.filter((res) => res.id !== reservationId) // Filter out if finishing means removing from current list
        );
      } else {
        setFinishMessage((prev) => ({
          ...prev,
          [reservationId]: {
            type: "error",
            text: response.data.message || "Failed to finish reservation.",
          },
        }));
      }
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        error.message ||
        "Error finishing reservation.";
      setFinishMessage((prev) => ({
        ...prev,
        [reservationId]: { type: "error", text: msg },
      }));
      console.error("Error finishing reservation:", error);
    } finally {
      setFinishLoading((prev) => ({ ...prev, [reservationId]: false }));
      setTimeout(() => {
        // Clear message after a few seconds
        setFinishMessage((prev) => ({ ...prev, [reservationId]: null }));
      }, 3000);
    }
  };

  // Helper to format date and time
  const formatDateTime = (dateTimeString) => {
    if (!dateTimeString) return "N/A";
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  if (loading) {
    return (
      <div className="rr-loading-message">
        <Loader className="spinner" size={28} /> Loading reservations...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rr-error-message">
        <AlertCircle className="icon" size={28} /> {error}
      </div>
    );
  }

  return (
    <div className="restaurant-reservations">
      <div className="rr-header">
        <h1>Restaurant Reservations</h1>
        <p>Manage incoming table reservations for your restaurant.</p>
      </div>

      {reservations.length === 0 ? (
        <div className="rr-no-reservations-found">
          <h3>No reservations found for your restaurant.</h3>
          <p>When customers reserve tables, they'll appear here.</p>
        </div>
      ) : (
        <div className="rr-reservations-grid">
          {reservations.map((reservation) => (
            <div key={reservation.id} className="reservation-card">
              <div className="rr-card-header">
                <h3 className="rr-card-title">
                  <Utensils size={20} /> Reservation #{reservation.id}
                </h3>
                <span
                  className={`rr-status-badge rr-status-${
                    reservation.status?.toLowerCase() || "unknown"
                  }`}
                >
                  {reservation.status || "Unknown"}
                </span>
              </div>

              <div className="rr-card-body">
                <p className="rr-info-item">
                  <Calendar size={18} />{" "}
                  <span className="rr-info-label">Reserved From:</span>{" "}
                  <strong>{formatDateTime(reservation.reserve_from)}</strong>
                </p>
                <p className="rr-info-item">
                  <Clock size={18} />{" "}
                  <span className="rr-info-label">Reserved Until:</span>{" "}
                  <strong>{formatDateTime(reservation.reserve_until)}</strong>
                </p>
                <p className="rr-info-item">
                  <Users size={18} />{" "}
                  <span className="rr-info-label">Guests:</span>{" "}
                  <strong>{reservation.number_of_persons || "N/A"}</strong>
                </p>
                <p className="rr-info-item">
                  <Utensils size={18} />{" "}
                  <span className="rr-info-label">Table Type:</span>{" "}
                  <strong>{reservation.table?.type || "N/A"}</strong>
                </p>
                <p className="rr-info-item">
                  <CheckCircle size={18} />{" "}
                  <span className="rr-info-label">Status:</span>{" "}
                  <strong
                    className={`rr-payment-status rr-payment-status-${
                      reservation.status?.toLowerCase() || "unknown"
                    }`}
                  >
                    {reservation.status || "N/A"}
                  </strong>
                </p>
                <p className="rr-info-item">
                  <User size={18} />{" "}
                  <span className="rr-info-label">Customer Name:</span>{" "}
                  <strong>
                    {reservation.user?.name || reservation.name || "N/A"}
                  </strong>{" "}
                  {/* Use user.name, fallback to top-level name */}
                </p>
                {reservation.user?.email && (
                  <p className="rr-info-item">
                    <Mail size={18} />{" "}
                    <span className="rr-info-label">Email:</span>{" "}
                    <a
                      href={`mailto:${reservation.user.email}`}
                      className="rr-customer-link"
                    >
                      {reservation.user.email}
                    </a>
                  </p>
                )}
                {reservation.user?.phone && ( // Using 'phone' as per your data, not 'phone_number'
                  <p className="rr-info-item">
                    <Phone size={18} />{" "}
                    <span className="rr-info-label">Phone:</span>{" "}
                    <a
                      href={`tel:${reservation.user.phone}`}
                      className="rr-customer-link"
                    >
                      {reservation.user.phone}
                    </a>
                  </p>
                )}
                {reservation.notes && (
                  <p className="rr-info-item rr-notes-item">
                    <FileText size={18} />{" "}
                    <span className="rr-info-label">Notes:</span>{" "}
                    {reservation.notes}
                  </p>
                )}
              </div>

              <div className="rr-card-actions">
                {reservation.status !== "finished" &&
                  reservation.status !== "cancelled" && (
                    <button
                      onClick={() => handleFinishReservation(reservation.id)}
                      className="rr-action-button rr-finish-button"
                      disabled={finishLoading[reservation.id]}
                    >
                      {finishLoading[reservation.id] ? (
                        <Loader className="spinner" size={20} />
                      ) : (
                        "Finish Reservation"
                      )}
                    </button>
                  )}
                {finishMessage[reservation.id] && (
                  <p
                    className={`rr-action-message rr-message-${
                      finishMessage[reservation.id].type
                    }`}
                  >
                    {finishMessage[reservation.id].type === "success" ? (
                      <CheckCircle size={18} />
                    ) : (
                      <AlertCircle size={18} />
                    )}
                    {finishMessage[reservation.id].text}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantReservations;
