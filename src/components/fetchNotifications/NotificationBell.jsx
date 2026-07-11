import React, { useState, useEffect, useRef } from 'react';
import axiosClient from '../../../axios-client';
import './NotificationBell.css';

export default function NotificationBell() {
  const [showPopup, setShowPopup] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bellRef = useRef(null);
  const popupRef = useRef(null);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axiosClient.get('/getNotifications');
      const notificationsData = response?.data?.data;
      if (Array.isArray(notificationsData)) {
        setNotifications(notificationsData);
      } else {
        console.warn("API did not return an array. Using empty array instead.", notificationsData);
        setNotifications([]);
      }
    } catch (err) {
      console.error("خطأ في جلب الإشعارات:", err);
      setError("فشل تحميل الإشعارات. الرجاء المحاولة مرة أخرى.");
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (id) => {
    try {
      await axiosClient.post(`/deleteNotification/${id}`);
      setNotifications(prev => prev.filter(noti => noti.id !== id));
    } catch (err) {
      console.error("خطأ في حذف الإشعار:", err);
      setError("فشل حذف الإشعار. الرجاء المحاولة مرة أخرى.");
    }
  };

  // Remove initial fetch on mount

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        bellRef.current && !bellRef.current.contains(event.target) &&
        popupRef.current && !popupRef.current.contains(event.target)
      ) {
        setShowPopup(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="notification-bell-container">
      <div
        className="notification-bell"
        onClick={() => {
          setShowPopup(prev => {
            const newState = !prev;
            if (newState) fetchNotifications();
            return newState;
          });
        }}
        ref={bellRef}
        aria-expanded={showPopup}
        aria-controls="notification-popup-content"
        role="button"
        tabIndex="0"
      >
        <svg
          className="bell-icon"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          width="24px"
          height="24px"
        >
          <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V9c0-3.15-2.2-5.76-5.2-6.32V2.5c0-.83-.67-1.5-1.5-1.5S9.5 1.67 9.5 2.5v.18C6.2 3.24 4 5.85 4 9v7l-2 2v1h20v-1l-2-2z" />
        </svg>
        {Array.isArray(notifications) && notifications.length > 0 && (
          <span className="notification-count">{notifications.length}</span>
        )}
      </div>

      {showPopup && (
        <div className="notification-popup" id="notification-popup-content" ref={popupRef}>
          <div className="popup-header">
            <h3>الإشعارات</h3>
            <button className="close-button" onClick={() => setShowPopup(false)} aria-label="إغلاق الإشعارات">
              &times;
            </button>
          </div>

          {loading ? (
            <p className="message">جاري تحميل الإشعارات...</p>
          ) : error ? (
            <p className="message error-message">{error}</p>
          ) : !Array.isArray(notifications) || notifications.length === 0 ? (
            <p className="message">لا توجد إشعارات جديدة.</p>
          ) : (
            <ul className="notification-list">
              {notifications.map(notification => (
                <li key={notification.id} className="notification-item">
                  <span className="notification-text">
                    {notification.data?.message || 'إشعار جديد'}
                  </span>
                  <button
                    className="delete-button"
                    onClick={() => deleteNotification(notification.id)}
                    aria-label={`حذف الإشعار ${notification.id}`}
                  >
                    حذف
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
