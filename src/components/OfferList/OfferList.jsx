import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { fetchRestaurantOffers, deleteOffer } from '../../actions/offersActions';
import './OfferList.css';

const OfferList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { restaurantOffers, loading, error } = useSelector(state => state.offer);
  const id = useSelector(state => state.authReducer.authData.data.restaurants[0].id);
  console.log(id)

  useEffect(() => {
    dispatch(fetchRestaurantOffers(id));
  }, [dispatch]);

  const handleDelete = async (offerId) => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await dispatch(deleteOffer(offerId));
      } catch (err) {
        console.error('Error deleting offer:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading offers...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="offers-container">
      <div className="offers-header">
        <h2>All Offers</h2>
        <button onClick={() => navigate('/offers/add')} className="add-offer-btn">
          Create New Offer
        </button>
      </div>

      <div className="offers-grid">
        {restaurantOffers.map(offer => (
          <div key={offer.id} className="offer-card">
            <div className="offer-header">
              <h3>{offer.title}</h3>
              <span className={`offer-type ${offer.offer_type}`}>
                {offer.offer_type === 'percentage' ? 'Discount' : 'Fixed Price'}
              </span>
            </div>
            
            <p className="offer-description">{offer.description}</p>
            
            <div className="offer-details">
              {offer.offer_type === 'percentage' ? (
                <span className="discount">{offer.discount_percentage}% OFF</span>
              ) : (
                <span className="fixed-price">${offer.fixed_price}</span>
              )}
              
              <div className="valid-dates">
                <span>Valid: {formatDate(offer.valid_from)}</span>
                <span>to {formatDate(offer.valid_until)}</span>
              </div>
            </div>
            
            <div className="offer-actions">
              <button 
                onClick={() => navigate(`/offers/${offer.id}`)}
                className="view-btn"
              >
                View Details
              </button>
              <button 
                onClick={() => handleDelete(offer.id)}
                className="delete-btn"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OfferList;