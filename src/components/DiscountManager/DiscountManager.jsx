import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Plus, CheckCircle, AlertCircle, Loader } from "lucide-react";
import {
  createDiscount,
  getAllDiscountsByRestaurant,
} from "../../actions/discountsActions";
import "./DiscountManager.css";

export default function DiscountManager({ restaurantId, onClose }) {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    discount_code: "",
    discount_amount: "",
    expiry_date: "",
    restaurants_id: restaurantId,
  });
  const [submissionLoading, setSubmissionLoading] = useState(false);
  const [submissionMessage, setSubmissionMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    if (restaurantId) {
      console.log("here");
      dispatch(getAllDiscountsByRestaurant(restaurantId));
    }
  }, [dispatch, restaurantId]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmissionLoading(true);
    setSubmissionMessage({ type: "", text: "" });
    try {
      const result = await dispatch(createDiscount(form));
      setSubmissionMessage({
        type: "success",
        text: result.message || "Discount created successfully!",
      });
      setForm({
        discount_code: "",
        discount_amount: "",
        expiry_date: "",
        restaurants_id: restaurantId,
      });
    } catch (err) {
      const msg =
        err.response?.data?.message ||
        err.message ||
        "Error creating discount.";
      setSubmissionMessage({ type: "error", text: msg });
    } finally {
      setSubmissionLoading(false);
      setTimeout(() => setSubmissionMessage({ type: "", text: "" }), 3000);
    }
  };

  return (
    <div className="discount-manager-panel">
      <h3 className="discount-manager-panel-title">Add New Discount</h3>

      <form onSubmit={handleSubmit} className="discount-manager-form-card">
        <div className="discount-manager-form-group">
          <label htmlFor="discountCode" className="discount-manager-form-label">
            Discount Code
          </label>
          <input
            type="text"
            id="discountCode"
            name="discount_code"
            placeholder="e.g., SUMMER20"
            className="discount-manager-form-input"
            value={form.discount_code}
            onChange={handleFormChange}
            required
          />
        </div>
        <div className="discount-manager-form-group">
          <label
            htmlFor="discountAmount"
            className="discount-manager-form-label"
          >
            Amount (%)
          </label>
          <input
            type="number"
            id="discountAmount"
            name="discount_amount"
            placeholder="e.g., 20"
            className="discount-manager-form-input"
            value={form.discount_amount}
            onChange={handleFormChange}
            required
            min="0"
            max="100"
          />
        </div>
        <div className="discount-manager-form-group">
          <label htmlFor="expiryDate" className="discount-manager-form-label">
            Expiry Date
          </label>
          <input
            type="date"
            id="expiryDate"
            name="expiry_date"
            className="discount-manager-form-input"
            value={form.expiry_date}
            onChange={handleFormChange}
            required
          />
        </div>
        <input
          type="hidden"
          name="restaurants_id"
          value={form.restaurants_id}
        />

        {submissionMessage.text && (
          <p className={`submission-message ${submissionMessage.type}`}>
            {submissionMessage.type === "success" ? (
              <CheckCircle size={18} />
            ) : (
              <AlertCircle size={18} />
            )}{" "}
            {submissionMessage.text}
          </p>
        )}

        <div className="discount-manager-form-actions">
          <button
            type="button"
            onClick={onClose}
            className="discount-manager-form-cancel-button"
            disabled={submissionLoading}
          >
            Close
          </button>
          <button
            type="submit"
            className="discount-manager-form-submit-button"
            disabled={submissionLoading}
          >
            {submissionLoading ? (
              <>
                <Loader className="spinner" size={20} /> Creating...
              </>
            ) : (
              <>
                <Plus size={18} /> Create Discount
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
