import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOfferDetails, deleteOffer } from '../../actions/offersActions';
import './OfferDetails.css';

const OfferDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { currentOffer: offer, loading, error } = useSelector(state => state.offer);

  useEffect(() => {
    dispatch(fetchOfferDetails(id));
  }, [id, dispatch]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this offer?')) {
      try {
        await dispatch(deleteOffer(id));
        navigate('/offers');
      } catch (err) {
        console.error('Error deleting offer:', err);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) return <div className="loading">Loading offer details...</div>;
  if (error) return <div className="error">Error: {error.message}</div>;
  if (!offer) return <div className="not-found">Offer not found</div>;

  return (
    <div className="offer-details-container">
      <div className="offer-details-header">
        <h2>{offer.title}</h2>
        <div className="action-buttons">
          <button onClick={() => navigate('/offers')} className="back-btn">
            Back to Offers
          </button>
          <button onClick={handleDelete} className="delete-btn">
            Delete Offer
          </button>
        </div>
      </div>

      <div className="offer-details-content">
        <div className="offer-main-info">
          <p className="description">{offer.description}</p>
          
          <div className="offer-type-info">
            {offer.offer_type === 'percentage' ? (
              <div className="percentage-info">
                <span className="discount-badge">{offer.discount_percentage}% OFF</span>
                <span>Discount Offer</span>
              </div>
            ) : (
              <div className="fixed-price-info">
                <span className="price-badge">${offer.fixed_price}</span>
                <span>Fixed Price Menu</span>
              </div>
            )}
          </div>

          <div className="validity-period">
            <h4>Validity Period</h4>
            <div className="dates">
              <div>
                <span>From:</span>
                <strong>{formatDate(offer.valid_from)}</strong>
              </div>
              <div>
                <span>To:</span>
                <strong>{formatDate(offer.valid_until)}</strong>
              </div>
            </div>
          </div>
        </div>

        {offer.offer_type === 'fixed_price' && offer.menu_items && (
          <div className="menu-items-section">
            <h3>Included Menu Items</h3>
            <div className="menu-items-list">
              {offer.menu_items.map(item => (
                <div key={item.id} className="menu-item-card">
                  <div className="item-info">
                    <h4>{item.name || `Item #${item.id}`}</h4>
                    <p>Quantity: {item.pivot.quantity}</p>
                  </div>
                  <div className="item-price">
                    <span>${item.price}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OfferDetails;