import React, { useState, useEffect } from 'react';
import { Loader, AlertCircle } from 'lucide-react'; // For icons
import axiosClient from '../../../axios-client';
import './WebsiteStats.css'
const WebsiteStats = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStats = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await axiosClient.get('/website-stats');
                if (response.data.success) {
                    setStats(response.data.data);
                } else {
                    setError(response.data.message || 'Failed to fetch website stats.');
                }
            } catch (err) {
                setError(err.message || 'Network error fetching stats.');
                console.error("Error fetching website stats:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    if (loading) return <div className="loading-message">Loading website statistics...</div>;
    if (error) return <div className="error-message"><AlertCircle size={20} /> Error: {error}</div>;
    if (!stats) return <div className="no-data-message">No statistics available.</div>;

    return (
        <div className="stats-container">
            <h2 className="stats-title">Website Statistics</h2>
            <div className="stats-grid">
                <div className="stats-card">
                    <h3>Restaurants</h3>
                    <p className="stat-value">{stats.restaurant_count}</p>
                </div>
                <div className="stats-card">
                    <h3>Normal Users</h3>
                    <p className="stat-value">{stats.normal_user_count}</p>
                </div>
                <div className="stats-card">
                    <h3>Total Orders</h3>
                    <p className="stat-value">{stats.order_count}</p>
                </div>
            </div>
        </div>
    );
};

export default WebsiteStats;