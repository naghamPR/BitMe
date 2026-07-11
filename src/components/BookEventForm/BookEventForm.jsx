import React, { useState } from 'react';
import { Loader, CheckCircle, AlertCircle, X } from 'lucide-react'; // Added X icon
import './BookEventForm.css'; // Component-specific CSS
import axiosClient from '../../../axios-client';

export default function BookEventForm ({ userId, restaurantId, setGlobalMessage, onBookingSuccess, onClose }) { // <-- Added onClose prop
  const [formData, setFormData] = useState({
    type: '',
    description: '',
    number_of_persons: '',
    booking_date: '',
    event_details: '',
  });
  const [loading, setLoading] = useState(false);
  const [localSubmissionMessage, setLocalSubmissionMessage] = useState(null);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLocalSubmissionMessage(null);
    if (setGlobalMessage) setGlobalMessage(null);

    if (!userId || !restaurantId) {
      const msg = 'User ID or Restaurant ID not available. Please log in or select a restaurant.';
      setLocalSubmissionMessage({ type: 'error', message: msg });
      if (setGlobalMessage) setGlobalMessage({ type: 'error', message: msg });
      return;
    }
    setLoading(true);

    try {
      const formattedBookingDate = formData.booking_date ?
                                   formData.booking_date.replace('T', ' ') + ':00' : '';

      const payload = {
        ...formData,
        restaurants_id: restaurantId,
        user_id: userId,
        booking_date: formattedBookingDate,
        description: formData.description,
      };

      const response = await axiosClient.post(`/book-event/${restaurantId}`, payload);

      if (response.data.success) {
        const msg = response.data.message || 'Event booked successfully!';
        setLocalSubmissionMessage({ type: 'success', message: msg });
        if (setGlobalMessage) setGlobalMessage({ type: 'success', message: msg });

        setFormData({ // Reset form fields
          type: '',
          description: '',
          number_of_persons: '',
          booking_date: '',
          event_details: '',
        });
        
        // Call parent's success handler, which might also close the modal
        if (onBookingSuccess) onBookingSuccess();
        
        // Optionally close the modal automatically after a delay if booking is successful
        // You might want to remove this if onBookingSuccess already handles closing the modal
        // setTimeout(onClose, 1500); 

      } else {
        const msg = response.data.message || 'Failed to book event.';
        setLocalSubmissionMessage({ type: 'error', message: msg });
        if (setGlobalMessage) setGlobalMessage({ type: 'error', message: msg });
      }
    } catch (error) {
      console.error('Error booking event:', error);
      const msg = error.response?.data?.message || error.message || 'Network error or server unavailable.';
      const errors = error.response?.data?.errors;
      let fullMessage = msg;
      if (errors) {
        Object.keys(errors).forEach(key => {
          fullMessage += `\n${key}: ${Array.isArray(errors[key]) ? errors[key].join(', ') : errors[key]}`;
        });
      }
      setLocalSubmissionMessage({ type: 'error', message: fullMessage });
      if (setGlobalMessage) setGlobalMessage({ type: 'error', message: fullMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bef-form-card">

      <form onSubmit={handleSubmit} className="bef-form">
      <button className="bef-close-button" onClick={onClose}> {/* <-- Added close button */}
        <X size={24} />
      </button>
        <h2 className="bef-form-title">Book New Event</h2>
        <div className="bef-form-group">
          <label htmlFor="type" className="bef-form-label">Event Type</label>
          <input
            type="text"
            id="type"
            name="type"
            placeholder="e.g., Birthday Party, Corporate Dinner"
            value={formData.type}
            onChange={handleChange}
            className="bef-form-input"
            required
          />
        </div>
        <div className="bef-form-group">
          <label htmlFor="description" className="bef-form-label">Description</label>
          <input
            type="text"
            id="description"
            name="description"
            placeholder="A brief description of the event"
            value={formData.description}
            onChange={handleChange}
            className="bef-form-input"
            required
          />
        </div>
        <div className="bef-form-group">
          <label htmlFor="number_of_persons" className="bef-form-label">Number of Persons</label>
          <input
            type="number"
            id="number_of_persons"
            name="number_of_persons"
            placeholder="Number of guests"
            value={formData.number_of_persons}
            onChange={handleChange}
            min="1"
            className="bef-form-input"
            required
          />
        </div>
        <div className="bef-form-group">
          <label htmlFor="booking_date" className="bef-form-label">Booking Date & Time</label>
          <input
            type="datetime-local"
            id="booking_date"
            name="booking_date"
            value={formData.booking_date}
            onChange={handleChange}
            className="bef-form-input"
            required
          />
        </div>
        <div className="bef-form-group">
          <label htmlFor="event_details" className="bef-form-label">Additional Event Details</label>
          <textarea
            id="event_details"
            name="event_details"
            placeholder="Any special requests or details"
            value={formData.event_details}
            onChange={handleChange}
            rows="3"
            className="bef-form-textarea"
            required
          ></textarea>
        </div>

        {localSubmissionMessage && (
            <p className={`bef-submission-message ${localSubmissionMessage.type}`}>
                {localSubmissionMessage.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />} {localSubmissionMessage.message}
            </p>
        )}

        <button type="submit" disabled={loading} className="bef-submit-button">
          {loading ? <><Loader className="spinner" size={20} /> Booking...</> : 'Book Event'}
        </button>
      </form>
    </div>
  );
};