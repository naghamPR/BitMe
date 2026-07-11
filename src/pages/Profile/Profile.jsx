import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link
import './Profile.css';

const Profile = () => {
  // Placeholder for authentication status - replace with actual logic
  // In a real app, this would come from context, Redux, or a hook
  const isLoggedIn = false; // Set to false to show the message initially

  // Placeholder user data - only used if isLoggedIn is true
  const initialUserData = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    profilePicture: '/src/assets/default-profile.png', // Ensure this asset exists or use a placeholder URL
    bio: 'Loves exploring new restaurants and cuisines.',
  };

  const [user, setUser] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialUserData);

  // --- Edit Mode Handlers (only relevant if logged in) ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSaveChanges = (e) => {
    e.preventDefault();
    console.log('Saving changes:', formData);
    setUser(formData);
    setIsEditing(false);
  };

  const handlePictureChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prevState => ({
          ...prevState,
          profilePicture: reader.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  // --- End Edit Mode Handlers ---

  // Render based on login status
  if (!isLoggedIn) {
    return (
      <div className="profile-page profile-unauthenticated">
        <div className="auth-message-box">
          <h2>Access Denied</h2>
          <p>You need to be logged in to view your profile.</p>
          <p>Please log in or create an account.</p>
          <div className="auth-buttons">
            <Link to="/login">
              <button className="auth-button login-button">Login</button>
            </Link>
            <Link to="/register">
              <button className="auth-button register-button">Sign up</button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // --- Logged-in User View ---
  return (
    <div className="profile-page">
      <div className="profile-header">
        <img 
          src={isEditing ? formData.profilePicture : user.profilePicture} 
          alt="Profile" 
          className="profile-picture"
          onError={(e) => { e.target.onerror = null; e.target.src="/src/assets/react.svg"}} // Basic fallback
        />
        <h1>{isEditing ? formData.name : user.name}</h1>
        <p className="profile-email">{user.email}</p>
      </div>

      <div className="profile-content">
        {isEditing ? (
          // Edit Form
          <form onSubmit={handleSaveChanges} className="profile-edit-form">
            <h2>Edit Profile</h2>
            <div className="form-group">
              <label htmlFor="profilePictureInput">Profile Picture</label>
              <input 
                type="file" 
                id="profilePictureInput"
                accept="image/*" 
                onChange={handlePictureChange} 
              />
            </div>
            <div className="form-group">
              <label htmlFor="name">Name</label>
              <input 
                type="text" 
                id="name"
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                required 
              />
            </div>
            <div className="form-group">
              <label htmlFor="bio">Bio</label>
              <textarea 
                id="bio"
                name="bio" 
                value={formData.bio} 
                onChange={handleInputChange} 
                rows="4"
              />
            </div>
            <div className="form-actions">
              <button type="submit" className="save-button">Save Changes</button>
              <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>Cancel</button>
            </div>
          </form>
        ) : (
          // Display View
          <>
            <h2>About Me</h2>
            <p className="profile-bio">{user.bio || 'No bio provided.'}</p>
            <button className="edit-profile-button" onClick={() => {
              setFormData(user);
              setIsEditing(true);
            }}>
              Edit Profile
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
