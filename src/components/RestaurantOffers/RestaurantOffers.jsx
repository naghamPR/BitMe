import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchRestaurantOffers } from '../../actions/offersActions';
import './RestaurantOffers.css';

const RestaurantOffers = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { restaurantOffers, loading, error } = useSelector(state => state.offer);

  useEffect(() => {
    dispatch(fetchRestaurantOffers(id));
  }, [id, dispatch]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading restaurant offers...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;

  return (
    <div className="restaurant-offers-container">
      <h2>Restaurant Offers</h2>
      
      {restaurantOffers.length === 0 ? (
        <div className="no-offers">This restaurant has no offers available.</div>
      ) : (
        <div className="offers-list">
          {restaurantOffers.map(offer => (
            <div key={offer.id} className="restaurant-offer-card">
              <h3>{offer.title}</h3>
              <p>{offer.description}</p>
              
              <div className="offer-details">
                {offer.offer_type === 'percentage' ? (
                  <span className="discount">{offer.discount_percentage}% OFF</span>
                ) : (
                  <span className="fixed-price">${offer.fixed_price}</span>
                )}
                
                <div className="valid-dates">
                  <span>Valid until: {formatDate(offer.valid_until)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RestaurantOffers;