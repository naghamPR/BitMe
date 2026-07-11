import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Trash2,
  Loader,
  AlertCircle,
  CheckCircle,
  Edit,
  X,
  Calendar,
  Users,
  Utensils,
  Home,
  Info,
  Clock, // Added more icons for detail
} from "lucide-react"; // Ensure these icons are imported

import "./MyEventBookingsPage.css"; // Component-specific CSS
import axiosClient from "../../../axios-client";

const MyEventBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const USER_ID = useSelector(
    (state) => state.authReducer?.authData?.data?.id || null
  );

  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState(null);

  const [isUpdateEventModalOpen, setUpdateEventModalOpen] = useState(false);
  const [eventToUpdate, setEventToUpdate] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateMessage, setUpdateMessage] = useState(null);

  useEffect(() => {
    const fetchMyEventBookings = async () => {
      setLoading(true);
      setError(null);
      try {
        if (!USER_ID) {
          setError("User not logged in. Please log in to view your bookings.");
          setLoading(false);
          return;
        }
        const response = await axiosClient.get(`/my-event-bookings`);
        if (response.data.success) {
          setBookings(response.data.data);
        } else {
          setError(
            response.data.message || "Failed to fetch your event bookings."
          );
        }
      } catch (err) {
        setError(err.message || "Network error fetching event bookings.");
        console.error("Error fetching my event bookings:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMyEventBookings();
  }, [USER_ID]);

  const handleDeleteBooking = async (bookingId) => {
    if (
      !window.confirm(
        "Are you sure you want to cancel this event booking? This action cannot be undone."
      )
    ) {
      return;
    }
    setDeleteLoading(true);
    setDeleteMessage(null);
    try {
      const response = await axiosClient.delete(`/event-booking/${bookingId}`);
      if (response.data.success) {
        setDeleteMessage({
          type: "success",
          message: response.data.message || "Booking cancelled successfully!",
        });
        setBookings((prevBookings) =>
          prevBookings.filter((b) => b.id !== bookingId)
        ); // Optimistically remove
      } else {
        setDeleteMessage({
          type: "error",
          message: response.data.message || "Failed to cancel booking.",
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error cancelling booking.";
      setDeleteMessage({ type: "error", message: msg });
      console.error("Error cancelling booking:", err);
    } finally {
      setDeleteLoading(false);
      setTimeout(() => setDeleteMessage(null), 3000);
    }
  };

  const openUpdateEventModal = (booking) => {
    setEventToUpdate(booking);
    setUpdateEventModalOpen(true);
    setUpdateMessage(null);
    document.body.style.overflow = "hidden";
  };

  const closeUpdateEventModal = () => {
    setEventToUpdate(null);
    setUpdateEventModalOpen(false);
    setUpdateMessage(null); // Clear message on close
    document.body.style.overflow = "unset";
    fetchMyEventBooking[USER_ID]; // Refresh bookings list
  };

  const handleSubmitUpdate = async (formData) => {
    setUpdateLoading(true);
    setUpdateMessage(null);
    try {
      const payload = {
        event_id: eventToUpdate.event_id, // Important for backend to know it's an update
        type: formData.type,
        description: formData.description,
        number_of_persons: formData.number_of_persons,
        booking_date: formData.booking_date,
        event_details: formData.event_details,
      };

      const response = await axiosClient.post(
        `/book-event/${eventToUpdate.restaurants_id}`,
        payload
      );

      if (response.data.success) {
        setUpdateMessage({
          type: "success",
          message: response.data.message || "Booking updated successfully!",
        });
        setTimeout(closeUpdateEventModal, 1500); // Close after brief success message
      } else {
        setUpdateMessage({
          type: "error",
          message: response.data.message || "Failed to update booking.",
        });
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Error updating booking.";
      const errors = err.response?.data?.errors;
      let fullMessage = msg;
      if (errors) {
        Object.keys(errors).forEach((key) => {
          fullMessage += `\n${key}: ${
            Array.isArray(errors[key]) ? errors[key].join(", ") : errors[key]
          }`;
        });
      }
      setUpdateMessage({ type: "error", message: fullMessage });
      console.error("Error updating booking:", err);
    } finally {
      setUpdateLoading(false);
    }
  };
  // --- End Update Event Logic ---

  if (loading)
    return (
      <div className="mebp-loading-message">
        <Loader className="spinner" size={24} /> Loading your event bookings...
      </div>
    );
  if (error)
    return (
      <div className="mebp-error-message">
        <AlertCircle className="icon" size={24} /> Error: {error}
      </div>
    );

  return (
    <div className="mebp-page-container">
      <h1 className="mebp-page-title">My Event Bookings</h1>
      <p className="mebp-page-description">
        Manage your upcoming and past event reservations.
      </p>

      {bookings.length === 0 ? (
        <div className="mebp-no-bookings-found">
          <h3>No event bookings found.</h3>
          <p>You haven't booked any events yet.</p>
          <Link to="/" className="mebp-action-button mebp-browse-button">
            Browse Restaurants & Events
          </Link>
        </div>
      ) : (
        <div className="mebp-bookings-grid">
          {bookings.map((booking) => (
            <div key={booking.id} className="mebp-booking-card">
              <div className="mebp-card-header">
                <h3 className="mebp-event-title">
                  {booking.event?.type || "Unnamed Event"}
                </h3>{" "}
                {/* Using event.type as main title */}
                <span
                  className={`mebp-booking-status mebp-status-${booking.status}`}
                >
                  {booking.status}
                </span>
              </div>
              <p className="mebp-info-text">
                <span className="mebp-info-label">
                  <Utensils size={18} /> Restaurant:
                </span>{" "}
                {booking.restaurant?.name || "N/A"}
              </p>{" "}
              {/* Corrected path */}
              <p className="mebp-info-text">
                <span className="mebp-info-label">
                  <Home size={18} /> Location:
                </span>{" "}
                {booking.restaurant?.location || "N/A"}
              </p>{" "}
              {/* Added location */}
              <p className="mebp-info-text">
                <span className="mebp-info-label">
                  <Info size={18} /> Event Description:
                </span>{" "}
                {booking.event?.Description || "No description provided."}
              </p>{" "}
              {/* Added Description */}
              <p className="mebp-info-text">
                <span className="mebp-info-label">
                  <Users size={18} /> Persons:
                </span>{" "}
                {booking.event?.number_of_persons || "N/A"}
              </p>
              <p className="mebp-info-text">
                <span className="mebp-info-label">
                  <Calendar size={18} /> Booking Date:
                </span>{" "}
                {new Date(booking.booking_date).toLocaleString()}
              </p>
              <p className="mebp-info-text mebp-details-text">
                <span className="mebp-info-label">Additional Details:</span>{" "}
                {booking.event_details || "None"}
              </p>
              <div className="mebp-card-actions">
                {booking.status !== "cancelled" &&
                booking.status !== "completed" ? (
                  <>
                    <button
                      className="mebp-action-button mebp-edit-btn"
                      onClick={() => openUpdateEventModal(booking)}
                      disabled={updateLoading}
                    >
                      <Edit size={18} /> Edit
                    </button>
                    <button
                      className="mebp-action-button mebp-cancel-btn"
                      onClick={() => handleDeleteBooking(booking.id)}
                      disabled={deleteLoading}
                    >
                      <Trash2 size={18} />{" "}
                      {deleteLoading ? "Cancelling..." : "Cancel Booking"}
                    </button>
                  </>
                ) : (
                  <span
                    className={`mebp-status-message mebp-status-message-${booking.status}`}
                  >
                    {booking.status === "cancelled"
                      ? "Booking Cancelled"
                      : "Event Completed"}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      {deleteMessage && (
        <div
          className={`mebp-notification mebp-notification-${deleteMessage.type}`}
        >
          {deleteMessage.type === "success" ? (
            <CheckCircle size={18} />
          ) : (
            <AlertCircle size={18} />
          )}{" "}
          {deleteMessage.message}
        </div>
      )}

      {/* Update Event Modal */}
      {isUpdateEventModalOpen && eventToUpdate && (
        <div
          className="mebp-modal-overlay open"
          onClick={closeUpdateEventModal}
        >
          <div
            className="mebp-modal-content mebp-medium-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mebp-modal-close-button"
              onClick={closeUpdateEventModal}
            >
              <X size={24} />
            </button>
            <h2 className="mebp-modal-title">Edit Event Booking</h2>

            <form
              onSubmit={(e) => {
                // Manual submit handler for form
                e.preventDefault();
                handleSubmitUpdate({
                  type: e.target.type.value,
                  description: e.target.description.value,
                  number_of_persons: parseInt(e.target.number_of_persons.value),
                  booking_date: e.target.booking_date.value,
                  event_details: e.target.event_details.value,
                });
              }}
              className="mebp-form"
            >
              <div className="mebp-form-group">
                <label htmlFor="updateType" className="mebp-form-label">
                  Event Type
                </label>
                <input
                  type="text"
                  id="updateType"
                  name="type"
                  defaultValue={eventToUpdate.event?.type || ""}
                  className="mebp-form-input"
                  required
                />
              </div>
              <div className="mebp-form-group">
                <label htmlFor="updateDescription" className="mebp-form-label">
                  Description
                </label>
                <input
                  type="text"
                  id="updateDescription"
                  name="description"
                  defaultValue={eventToUpdate.event?.Description || ""} // Note: Backend uses 'Description'
                  className="mebp-form-input"
                  required
                />
              </div>
              <div className="mebp-form-group">
                <label
                  htmlFor="updateNumberOfPersons"
                  className="mebp-form-label"
                >
                  Number of Persons
                </label>
                <input
                  type="number"
                  id="updateNumberOfPersons"
                  name="number_of_persons"
                  defaultValue={eventToUpdate.event?.number_of_persons || ""}
                  min="1"
                  className="mebp-form-input"
                  required
                />
              </div>
              <div className="mebp-form-group">
                <label htmlFor="updateBookingDate" className="mebp-form-label">
                  Booking Date & Time
                </label>
                <input
                  type="datetime-local"
                  id="updateBookingDate"
                  name="booking_date"
                  // Format existing date to YYYY-MM-DDTHH:MM for datetime-local input
                  defaultValue={
                    eventToUpdate.booking_date
                      ? new Date(eventToUpdate.booking_date)
                          .toISOString()
                          .slice(0, 16)
                      : ""
                  }
                  className="mebp-form-input"
                  required
                />
              </div>
              <div className="mebp-form-group">
                <label htmlFor="updateEventDetails" className="mebp-form-label">
                  Additional Event Details
                </label>
                <textarea
                  id="updateEventDetails"
                  name="event_details"
                  defaultValue={eventToUpdate.event_details || ""}
                  rows="3"
                  className="mebp-form-textarea"
                  required
                ></textarea>
              </div>

              {updateMessage && (
                <p className={`mebp-submission-message ${updateMessage.type}`}>
                  {updateMessage.type === "success" ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}{" "}
                  {updateMessage.message}
                </p>
              )}

              <div className="mebp-modal-actions">
                <button
                  type="button"
                  onClick={closeUpdateEventModal}
                  className="mebp-action-button mebp-cancel-button"
                  disabled={updateLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="mebp-action-button mebp-submit-button"
                  disabled={updateLoading}
                >
                  {updateLoading ? (
                    <Loader className="spinner" size={20} />
                  ) : (
                    "Save Changes"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyEventBookingsPage;
