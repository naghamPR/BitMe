import React, { useState } from "react";
import axiosClient from "../../../axios-client"; // Ensure you have axios set up

const TopUpWallet = () => {
  const [userId, setUserId] = useState("");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userId || !amount) {
      setMessage("Please fill out both fields.");
      return;
    }

    setIsLoading(true);
    setMessage("");

    // Prepare FormData
    const formData = new FormData();
    formData.append("user_id", userId);
    formData.append("amount", amount);

    try {
      const response = await axiosClient.post("/AddBalance", formData);

      if (response.data.success) {
        setMessage(`Success! Your new balance is ${response.data.new_balance}`);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || "Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="top-up-wallet-container">
      <h2>Top Up Your Wallet</h2>
      <form onSubmit={handleSubmit} className="top-up-form">
        <div className="form-group">
          <label htmlFor="user_id">User ID:</label>
          <input
            type="text"
            id="user_id"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="0.01"
            step="0.01"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? "Processing..." : "Top Up"}
        </button>
      </form>

      {message && <p className="message">{message}</p>}
    </div>
  );
};

export default TopUpWallet;
