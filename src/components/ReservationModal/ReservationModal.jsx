import React, { useState, useEffect } from "react";
import { X, Loader } from "lucide-react";
import "./ReservationModal.css";

const ReservationModal = ({ isOpen, onClose, table, onSubmit }) => {
  const [form, setForm] = useState({
    number_of_persons: "",
    notes: "",
    reserve_from: "",
    reserve_until: "",
  });
  const [loading, setLoading] = useState(false);

  // Effect to reset the form when the modal is opened for a new table
  useEffect(() => {
    if (isOpen) {
      setForm({
        number_of_persons: "",
        notes: "",
        reserve_from: "",
        reserve_until: "",
      });
    }
  }, [isOpen, table]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // Pass the form data along with the table_id to the parent's submit handler
      await onSubmit({
        tables_id: table.id,
        ...form,
      });
      // The parent component is responsible for closing the modal on success
    } catch (error) {
      console.error("Reservation submission error:", error);
      // Optional: Display an error message within the modal
    } finally {
      setLoading(false);
    }
  };

  // The conditional rendering `if (!isOpen) return null;` has been removed.
  // The parent component now controls the rendering.

  return (
    // The overlay and content now use the `rd-` prefixed classes for correct styling from the parent's CSS
    <div className="rd-modal-content" onClick={(e) => e.stopPropagation()}>
      <button className="rd-modal-close-button" onClick={onClose}>
        <X size={24} />
      </button>

      <h2>Reserve Table</h2>

      {table && (
        <div className="reservation-container">
          {/* Table Info */}
          <div className="table-info">
            <h3>{table.type} Table</h3>
            <p>Capacity: {table.number_of_persons} persons</p>
            <p>Available: {table.available_count}</p>
          </div>

          {/* Reservation Form */}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="number_of_persons">Number of Persons *</label>
              <input
                id="number_of_persons"
                type="number"
                name="number_of_persons"
                value={form.number_of_persons}
                onChange={handleChange}
                min="1"
                max={table.number_of_persons}
                required
                className="form-input"
                placeholder={`e.g., 2 (max: ${table.number_of_persons})`}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label className="form-label" htmlFor="reserve_from">Start Time *</label>
                <input
                  id="reserve_from"
                  type="datetime-local"
                  name="reserve_from"
                  value={form.reserve_from}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="reserve_until">End Time *</label>
                <input
                  id="reserve_until"
                  type="datetime-local"
                  name="reserve_until"
                  value={form.reserve_until}
                  onChange={handleChange}
                  required
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label special-label" htmlFor="notes">Special Requests</label>
              <textarea
                id="notes"
                className="form-textarea special-textarea"
                name="notes"
                value={form.notes}
                onChange={handleChange}
                rows="3"
                placeholder="e.g., table near a window"
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} disabled={loading} className="cancel-button">
                Cancel
              </button>
              <button type="submit" disabled={loading} className="submit-button">
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} /> Confirming...
                  </>
                ) : (
                  "Confirm Reservation"
                )}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default ReservationModal;