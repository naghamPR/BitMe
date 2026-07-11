import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import "./RestaurantTables.css";
import { useSelector } from "react-redux";
import {
  PlusCircle,
  Edit,
  Trash2,
  X,
  Loader,
  Table as TableIcon,
  Users,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

const RestaurantTables = () => {
  const restaurantId = useSelector(
    (state) => state.authReducer.authData.data.restaurants[0].id
  );
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingTable, setEditingTable] = useState(null);
  const [form, setForm] = useState({
    type: "",
    number_of_persons: "",
    count: "",
  });
  const [submitLoading, setSubmitLoading] = useState(false);
  const [formMessage, setFormMessage] = useState({ type: "", text: "" });

  const fetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axiosClient.get(`/tablesRes/${restaurantId}`);
      setTables(res.data.data);
    } catch (err) {
      console.error("Failed to fetch tables", err);
      setError("Failed to load tables. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (restaurantId) {
      fetchTables();
    } else {
      setError("Restaurant ID not found. Cannot fetch tables.");
      setLoading(false);
    }
  }, [restaurantId]);

  const handleDelete = async (id) => {
    if (
      !window.confirm(
        "Are you sure you want to delete this table? This action cannot be undone."
      )
    )
      return;
    try {
      await axiosClient.post(`/tables/${id}`);
      fetchTables();
    } catch (err) {
      alert("Failed to delete table."); // Consider using a nicer message display
      console.error("Error deleting table:", err);
    }
  };

  const openCreate = () => {
    setForm({ type: "", number_of_persons: "", count: "" });
    setEditingTable(null);
    setFormMessage({ type: "", text: "" });
    setShowModal(true);
  };

  const openEdit = (table) => {
    setForm({
      type: table.type,
      number_of_persons: table.number_of_persons,
      count: table.count,
    });
    setEditingTable(table);
    setFormMessage({ type: "", text: "" });
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitLoading(true);
    setFormMessage({ type: "", text: "" });

    const data = {
      ...form,
      number_of_persons: parseInt(form.number_of_persons),
      count: parseInt(form.count),
    };

    try {
      if (editingTable) {
        await axiosClient.post(`/tablesupdate/${editingTable.id}`, data);
        setFormMessage({
          type: "success",
          text: "Table updated successfully!",
        });
      } else {
        await axiosClient.post("/tables", {
          ...data,
          restaurants_id: restaurantId,
        });
        setFormMessage({
          type: "success",
          text: "Table created successfully!",
        });
      }
      setTimeout(() => {
        setShowModal(false);
        fetchTables();
      }, 1500);
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Failed to save table.";
      setFormMessage({ type: "error", text: msg });
      console.error("Error saving table:", err);
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="rt-loading-message">
        <Loader className="spinner" size={28} /> Loading tables...
      </div>
    );
  }

  if (error) {
    return (
      <div className="rt-error-message">
        <AlertCircle className="icon" size={28} /> {error}
      </div>
    );
  }

  return (
    <div className="restaurant-tables-container">
      <div className="rt-header">
        <h2>
          <TableIcon size={28} /> Restaurant Tables
        </h2>
        <button className="rt-add-table-btn" onClick={openCreate}>
          <PlusCircle size={20} /> Add Table
        </button>
      </div>

      {tables.length === 0 ? (
        <div className="rt-no-tables-found">
          <h3>No tables found for your restaurant.</h3>
          <p>Click "Add Table" to get started!</p>
        </div>
      ) : (
        <div className="rt-table-list-grid">
          {tables.map((table) => (
            <div key={table.id} className="rt-table-card">
              <h4 className="rt-table-type">{table.type}</h4>
              <div className="rt-table-details">
                <p>
                  <Users size={18} /> <span>Seats:</span>{" "}
                  <strong>{table.number_of_persons}</strong>
                </p>
                <p>
                  <TableIcon size={18} /> <span>Count:</span>{" "}
                  <strong>{table.count}</strong>
                </p>
                <p>
                  <CheckCircle size={18} /> <span>Available:</span>{" "}
                  <strong>{table.available_count}</strong>
                </p>
              </div>
              <div className="rt-table-actions">
                <button
                  onClick={() => openEdit(table)}
                  className="rt-action-button rt-edit-btn"
                >
                  <Edit size={18} /> Edit
                </button>
                <button
                  onClick={() => handleDelete(table.id)}
                  className="rt-action-button rt-delete-btn"
                >
                  <Trash2 size={18} /> Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div
          className="rt-modal-overlay open"
          onClick={() => setShowModal(false)}
        >
          <div className="rt-modal-box" onClick={(e) => e.stopPropagation()}>
            <button
              className="rt-modal-close-btn"
              onClick={() => setShowModal(false)}
            >
              <X size={24} />
            </button>
            <h3 className="rt-modal-title">
              {editingTable ? "Edit Table" : "Create Table"}
            </h3>
            <form onSubmit={handleSubmit} className="rt-modal-form">
              <div className="rt-form-group">
                <label className="rt-form-label">Type</label>
                <input
                  type="text"
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  required
                  className="rt-form-input"
                  placeholder="e.g., Dining, Bar, Outdoor"
                />
              </div>

              <div className="rt-form-group">
                <label className="rt-form-label">Number of Persons</label>
                <input
                  type="number"
                  value={form.number_of_persons}
                  onChange={(e) =>
                    setForm({ ...form, number_of_persons: e.target.value })
                  }
                  min="1"
                  required
                  className="rt-form-input"
                  placeholder="e.g., 2, 4, 6"
                />
              </div>

              <div className="rt-form-group">
                <label className="rt-form-label">Count</label>
                <input
                  type="number"
                  value={form.count}
                  onChange={(e) => setForm({ ...form, count: e.target.value })}
                  min="1"
                  required
                  className="rt-form-input"
                  placeholder="Number of tables of this type"
                />
              </div>

              {formMessage.text && (
                <p className={`rt-form-message rt-message-${formMessage.type}`}>
                  {formMessage.type === "success" ? (
                    <CheckCircle size={18} />
                  ) : (
                    <AlertCircle size={18} />
                  )}{" "}
                  {formMessage.text}
                </p>
              )}

              <div className="rt-button-group">
                <button
                  type="button"
                  className="rt-btn-cancel"
                  onClick={() => setShowModal(false)}
                  disabled={submitLoading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rt-btn-save"
                  disabled={submitLoading}
                >
                  {submitLoading ? (
                    <>
                      <Loader className="spinner" size={20} /> Saving...
                    </>
                  ) : (
                    "Save"
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

export default RestaurantTables;
