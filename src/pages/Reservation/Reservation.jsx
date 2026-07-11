import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { useParams, useNavigate } from "react-router-dom";
import { makeReservation } from "../../actions/reservationsActions";
import ReservationModal from "../../components/ReservationModal/ReservationModal";
import axiosClient from "../../../axios-client";

const Reservation = () => {
  const { restaurantId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [tables, setTables] = useState([]);
  const [form, setForm] = useState({
    tables_id: "",
    number_of_persons: "",
    notes: "",
    reserve_from: "",
    reserve_until: "",
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    // Fetch tables for this restaurant
    axiosClient
      .get(`/restaurant/${restaurantId}/tables`)
      .then((res) => setTables(res.data.data))
      .catch((err) => console.error("Failed to load tables", err));
  }, [restaurantId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const openModalWithTable = (table) => {
    setSelectedTable(table);
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setSelectedTable(null);
  };

  const handleModalSubmit = (reservationData) => {
    dispatch(makeReservation(reservationData));
    closeModal();
    navigate("/my-reservations");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(makeReservation(form));
    navigate("/my-reservations"); // Redirect after success
  };

  return (
    <div className="reservation-page">
      <h2>Make a Reservation</h2>
      <form onSubmit={handleSubmit} className="reservation-form">
        <label>Choose Table</label>
        <select
          name="tables_id"
          value={form.tables_id}
          onChange={handleChange}
          required
        >
          <option value="">Select a table</option>
          {tables.map((table) => (
            <option key={table.id} value={table.id}>
              Table #{table.id} - {table.available_count} available
            </option>
          ))}
        </select>

        <label>Number of Persons</label>
        <input
          type="number"
          name="number_of_persons"
          value={form.number_of_persons}
          onChange={handleChange}
          required
        />

        <label>Reservation Start</label>
        <input
          type="datetime-local"
          name="reserve_from"
          value={form.reserve_from}
          onChange={handleChange}
          required
        />

        <label>Reservation End</label>
        <input
          type="datetime-local"
          name="reserve_until"
          value={form.reserve_until}
          onChange={handleChange}
          required
        />

        <label>Notes (optional)</label>
        <textarea name="notes" value={form.notes} onChange={handleChange} />

        <button type="submit" className="submit-reservation-button">
          Submit Reservation
        </button>
      </form>
    </div>
  );
};

export default Reservation;
