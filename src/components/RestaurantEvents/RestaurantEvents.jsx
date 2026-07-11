import React, { useEffect, useState } from 'react';
import axiosClient from '../../../axios-client';
import { useSelector } from 'react-redux';
import './RestaurantEvents.css';

const RestaurantEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finishing, setFinishing] = useState(null);
  const [accepting, setAccepting] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const RES_ID = useSelector(state => state.authReducer.authData.data.restaurants[0].id);

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await axiosClient.get(`restaurant-events/${RES_ID}`);
      setEvents(res.data.data || []);
    } catch (err) {
      setError('Failed to fetch events.');
    } finally {
      setLoading(false);
    }
  };

  const acceptBooking = async (bookingId) => {
    try {
      setAccepting(bookingId);
      setSuccessMessage('');
      setError('');

      await axiosClient.post(`acceptEventBooking/${bookingId}`);
      setSuccessMessage('Booking accepted successfully.');
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to accept the booking.');
    } finally {
      setAccepting(null);
    }
  };

  const rejectBooking = async (bookingId) => {
    try {
      setRejecting(bookingId);
      setSuccessMessage('');
      setError('');

      await axiosClient.post(`rejectEventBooking/${bookingId}`);
      setSuccessMessage('Booking rejected successfully.');
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reject the booking.');
    } finally {
      setRejecting(null);
    }
  };

  const finishBooking = async (bookingId) => {
    try {
      setFinishing(bookingId);
      setSuccessMessage('');
      setError('');

      await axiosClient.post(`finish-event/${bookingId}`);
      setSuccessMessage('Booking marked as completed.');
      fetchEvents();
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to mark booking as completed.');
    } finally {
      setFinishing(null);
    }
  };

  return (
    <div className="restaurant-events-container">
      <h2>📅 Restaurant Events</h2>

      {loading ? (
        <p>Loading...</p>
      ) : (
        events.map(event => (
          <div key={event.id} className="event-card">
            <h3 className="event-title">🏷️ Event #{event.id}: {event.type}</h3>
            <p className="event-info">👥 Number of Persons: {event.number_of_persons}</p>
            <p className="event-info">📝 Description: {event.Description}</p>
            <p className="event-date">Created At: {new Date(event.created_at).toLocaleString()}</p>

            <div className="booking-list">
              {event.bookings.map(booking => (
                <div key={booking.id} className="booking-card">
                  <div className="booking-info">
                    <p>👤 {booking.user?.name}</p>
                    <p>Status: <span className="booking-status">{booking.status}</span></p>
                    <p>Booking Date: {new Date(booking.booking_date).toLocaleString()}</p>
                  </div>

                  {booking.status === 'pending' ? (
                    <div className="button-group">
                      <button
                        className="accept-btn"
                        onClick={() => acceptBooking(booking.id)}
                        disabled={accepting === booking.id}
                      >
                        {accepting === booking.id ? 'Accepting...' : 'Accept Booking'}
                      </button>

                      <button
                        className="reject-btn"
                        onClick={() => rejectBooking(booking.id)}
                        disabled={rejecting === booking.id}
                      >
                        {rejecting === booking.id ? 'Rejecting...' : 'Reject Booking'}
                      </button>

                      <button
                        className="finish-btn"
                        onClick={() => finishBooking(booking.id)}
                        disabled={finishing === booking.id}
                      >
                        {finishing === booking.id ? 'Finishing...' : 'Mark as Completed'}
                      </button>
                    </div>
                  ) : (
                    <span className="booking-status">{booking.status}</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))
      )}

      {successMessage && <p className="success-message">{successMessage}</p>}
      {error && <p className="error-message">{error}</p>}
    </div>
  );
};

export default RestaurantEvents;
