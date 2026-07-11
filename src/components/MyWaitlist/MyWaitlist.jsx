import React, { useEffect, useState } from "react";
import axiosClient from "../../../axios-client";
import { Clock, Users, Calendar, Utensils, Home, Info } from 'lucide-react'; // Added icons for better visuals
import './MyWaitlist.css'; // Component-specific CSS

const MyWaitlist = () => {
  const [waitlist, setWaitlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchWaitlist = async () => {
      try {
        const response = await axiosClient.get("/my-waitlist");
        setWaitlist(response.data.waitlist);
      } catch (error) {
        setError("Failed to load your waitlist.");
        console.error("Error fetching waitlist:", error); // Log the error for debugging
      } finally {
        setLoading(false);
      }
    };

    fetchWaitlist();
  }, []);

  // Helper function to format duration into a more readable format
  const formatDuration = (minutes) => {
    const absMinutes = Math.abs(minutes);
    if (absMinutes === 0) return "0 minutes";
    if (absMinutes < 60) return `${absMinutes} minutes`;

    const hours = Math.floor(absMinutes / 60);
    const remainingMinutes = absMinutes % 60;

    let timeString = `${hours} hour${hours > 1 ? 's' : ''}`;
    if (remainingMinutes > 0) {
      timeString += ` and ${remainingMinutes} minute${remainingMinutes > 1 ? 's' : ''}`;
    }
    return timeString;
  };

  if (loading) {
    return (
      <div className="my-waitlist-container loading">
        <p>Loading your waitlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="my-waitlist-container error-message">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <div className="my-waitlist-container">
      <div className="waitlist-header">
        <h2>My Waitlist</h2>
      </div>

      {waitlist.length === 0 && (
        <div className="empty-waitlist">
          <p className="description">
            You are not on any waitlists at the moment.
          </p>
        </div>
      )}

      {waitlist.length > 0 && (
        <div className="waitlist-grid"> {/* Changed to grid for potentially better layout */}
          {waitlist.map((waitlistItem) => (
            <div key={waitlistItem.id} className="waitlist-card">
              <div className="card-header">
                <h3><Utensils size={20} /> {waitlistItem.restaurant.name}</h3>
                <span className={`status-badge status-${waitlistItem.status.toLowerCase()}`}>
                  {waitlistItem.status}
                </span>
              </div>
              <div className="card-body">
                <p><Home size={16} /> <strong>Table Type:</strong> {waitlistItem.table.type}</p>
                <p><Users size={16} /> <strong>Persons:</strong> {waitlistItem.table.number_of_persons}</p>
                <p><Clock size={16} /> <strong>Wait Time:</strong> {formatDuration(waitlistItem.duration)}</p>
                <p><Calendar size={16} /> <strong>Queued Since:</strong> {new Date(waitlistItem.created_at).toLocaleString()}</p>
                <p><Info size={16} /> <strong>Location:</strong> {waitlistItem.restaurant.location}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyWaitlist;