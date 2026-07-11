import React, { useState, useEffect } from 'react';
import { X, ShoppingCart, Loader, Minus, Plus, CheckCircle, AlertCircle } from 'lucide-react';
import './MenuOrderModal.css'; // Component-specific CSS

const MenuOrderModal = ({
    restaurant, // Full restaurant object
    orderCart,
    handleAddItemToOrder,
    handleApplyOfferToCart,
    handleQuantityChange,
    handleCancelOrder,
    calculateOrderTotal,
    handleConfirmOrder,
    orderResponseMessage,
    isOrderConfirmationModalOpen,
    isOrderErrorModalOpen,
    closeOrderConfirmationModal,
    closeOrderErrorModal,
    openOrderErrorModal, // In case MenuOrderModal needs to trigger an error message
    onClose, // To close this MenuOrderModal itself
    userId // Passed from RestaurantDetail
}) => {
    const baseURL = "http://localhost:8000"; // Ensure consistent base URL
    const totalCartItems = orderCart.type === 'normal' ? orderCart.items.length : (orderCart.offer ? orderCart.offerCount : 0);

    return (
        <div className="mom-modal-overlay open" onClick={onClose}>
            <div className="mom-modal-content mom-large-modal" onClick={e => e.stopPropagation()}>
                <button className="mom-modal-close-button" onClick={onClose}><X size={24} /></button>
                <h2 className="mom-modal-title">Order from {restaurant.name}</h2>

                <div className="mom-content-grid">
                    {/* Left Section: Menus and Items */}
                    <div className="mom-menus-section">
                        <h3>Browse Menus</h3>
                        {restaurant.menus && restaurant.menus.length > 0 ? (
                            <div className="mom-menus-container">
                                {restaurant.menus.map(menu => (
                                    <div key={menu.id} className="mom-menu-card">
                                        <h4>{menu.name}</h4>
                                        {menu.description && <p className="mom-menu-description">{menu.description}</p>}
                                        {menu.menu_items && menu.menu_items.length > 0 ? (
                                            <ul className="mom-menu-items-list">
                                                {menu.menu_items.map(item => (
                                                    <li key={item.id} className="mom-menu-item">
                                                        <div>
                                                            <p className="mom-menu-item-name">{item.name}</p>
                                                            {item.description && <p className="mom-menu-item-description">{item.description}</p>}
                                                        </div>
                                                        <div className="mom-menu-item-actions">
                                                            <span className="mom-menu-item-price">${parseFloat(item.price).toFixed(2)}</span>
                                                            <button
                                                                className="mom-action-button mom-add-to-order-button"
                                                                onClick={() => handleAddItemToOrder(item, menu.name)}
                                                            >
                                                                <Plus size={16} /> Add
                                                            </button>
                                                        </div>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : <p className="mom-no-items-in-menu">No items in this menu.</p>}
                                    </div>
                                ))}
                            </div>
                        ) : <p className="mom-no-data">No menus available for this restaurant.</p>}
                    </div>

                    {/* Right Section: Offers and Order Summary */}
                    <div className="mom-summary-section">
                        {/* Offers */}
                        <h3>Special Offers</h3>
                        {restaurant.offer && restaurant.offer.length > 0 ? (
                            <ul className="mom-offers-list">
                                {restaurant.offer.map(offer => (
                                    <li key={offer.id} className="mom-offer-item-card">
                                        <p className="mom-offer-title"><strong>{offer.title}</strong></p>
                                        {offer.description && <p className="mom-offer-description">{offer.description}</p>}
                                        <p className="mom-offer-price-type">
                                            {offer.offer_type === 'percentage' ? (
                                                <>Discount: {parseFloat(offer.discount_percentage).toFixed(2)}%</>
                                            ) : (
                                                <>Fixed Price: ${parseFloat(offer.fixed_price).toFixed(2)}</>
                                            )}
                                        </p>
                                        <p className="mom-offer-validity">
                                            Valid: {new Date(offer.valid_from).toLocaleDateString()} - {new Date(offer.valid_until).toLocaleDateString()}
                                        </p>
                                        <button
                                            className="mom-action-button mom-apply-offer-button"
                                            onClick={() => handleApplyOfferToCart(offer)}
                                        >
                                            Apply Offer
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        ) : <p className="mom-no-data">No special offers available.</p>}

                        {/* Order Cart Summary */}
                        <div className="mom-order-cart-summary">
                            {/* Loading overlay for order confirmation */}
                            {loading && <div className="mom-cart-overlay-loading"><Loader className="spinner" size={32} /></div>}

                            <div className="mom-cart-header">
                                <ShoppingCart size={24} />
                                <h3>Your Order ({totalCartItems} {orderCart.type === 'normal' ? 'items' : 'offer'})</h3>
                            </div>
                            <ul className="mom-cart-items-list">
                                {orderCart.type === 'normal' && orderCart.items.map(item => (
                                    <li key={item.id} className="mom-cart-item">
                                        <div className="mom-cart-item-info">
                                            <p className="mom-cart-item-name">{item.name}</p>
                                            <p className="mom-cart-item-menu">{item.menuName}</p>
                                        </div>
                                        <div className="mom-cart-item-quantity-controls">
                                            <button onClick={() => handleQuantityChange('item', item.id, -1)} className="mom-quantity-button"><Minus size={16} /></button>
                                            <span className="mom-quantity-display">{item.quantity}</span>
                                            <button onClick={() => handleQuantityChange('item', item.id, 1)} className="mom-quantity-button"><Plus size={16} /></button>
                                        </div>
                                        <span className="mom-cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                                    </li>
                                ))}
                                {orderCart.type === 'offer' && orderCart.offer && (
                                    <li key={orderCart.offer.id} className="mom-cart-item mom-offer-item">
                                        <div className="mom-cart-item-info">
                                            <p className="mom-cart-item-name">Offer: {orderCart.offer.title}</p>
                                            <p className="mom-cart-item-menu">{orderCart.offer.description}</p>
                                        </div>
                                        <div className="mom-cart-item-quantity-controls">
                                            <button onClick={() => handleQuantityChange('offer', orderCart.offer.id, -1)} className="mom-quantity-button"><Minus size={16} /></button>
                                            <span className="mom-quantity-display">{orderCart.offerCount}</span>
                                            <button onClick={() => handleQuantityChange('offer', orderCart.offer.id, 1)} className="mom-quantity-button"><Plus size={16} /></button>
                                        </div>
                                        <span className="mom-cart-item-price">${(orderCart.offer.fixed_price * orderCart.offerCount).toFixed(2)}</span>
                                    </li>
                                )}
                            </ul>
                            <div className="mom-cart-total">
                                <span>Total:</span>
                                <span>${calculateOrderTotal().toFixed(2)}</span>
                            </div>
                            <div className="mom-cart-actions">
                                <button className="mom-confirm-order-button" onClick={handleConfirmOrder} disabled={loading}>
                                    {loading ? <Loader className="spinner" size={20} /> : 'Confirm Order'}
                                </button>
                                <button className="mom-cancel-order-button" onClick={handleCancelOrder} disabled={loading}>
                                    Cancel Order
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Order Confirmation/Error Modal (Rendered conditionally) --- */}
                {(isOrderConfirmationModalOpen || isOrderErrorModalOpen) && (
                    <div className={`mom-modal-overlay-inner ${isOrderConfirmationModalOpen || isOrderErrorModalOpen ? 'open' : ''}`} onClick={() => {
                        if (isOrderConfirmationModalOpen) closeOrderConfirmationModal();
                        if (isOrderErrorModalOpen) closeOrderErrorModal();
                    }}>
                        <div className="mom-modal-content-inner mom-small-modal-inner" onClick={e => e.stopPropagation()}>
                            <button className="mom-modal-close-button-inner" onClick={() => {
                                if (isOrderConfirmationModalOpen) closeOrderConfirmationModal();
                                if (isOrderErrorModalOpen) closeOrderErrorModal();
                            }}><X /></button>
                            <h2 className={isOrderErrorModalOpen ? 'mom-error-title-inner' : 'mom-success-title-inner'}>
                                {isOrderErrorModalOpen ? 'Order Failed!' : 'Order Confirmed!'}
                            </h2>
                            <p className="mom-order-message-inner">{orderResponseMessage}</p>
                            {isOrderConfirmationModalOpen && (
                                <p className="mom-order-summary-message-inner">
                                    Your order total was: ${calculateOrderTotal().toFixed(2)}.
                                </p>
                            )}
                            <button className="mom-action-button-inner" onClick={() => {
                                if (isOrderConfirmationModalOpen) closeOrderConfirmationModal();
                                if (isOrderErrorModalOpen) closeOrderErrorModal();
                            }}>
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default MenuOrderModal;