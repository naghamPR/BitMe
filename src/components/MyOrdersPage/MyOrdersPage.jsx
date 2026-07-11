import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Trash2,
  DollarSign,
  X,
  CheckCircle,
  AlertCircle,
  Loader,
  Edit,
  Plus,
  Minus,
  ShoppingCart,
  Wallet,
  Calculator,
  Users,
} from "lucide-react";
import "./MyOrdersPage.css";
import axiosClient from "../../../axios-client";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const USER_ID = useSelector(
    (state) => state.authReducer?.authData?.data?.id || null
  );

  // Payment Modal States
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedOrderForPayment, setSelectedOrderForPayment] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("");
  const [paymentLoading, setPaymentLoading] = useState(false);
  const [paymentMessage, setPaymentMessage] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [userWalletBalance, setUserWalletBalance] = useState(0);
  const [walletBalanceLoading, setWalletBalanceLoading] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState("");
  const [topUpLoading, setTopUpLoading] = useState(false);
  const [topUpMessage, setTopUpMessage] = useState("");
  const [cardCode, setCardCode] = useState("");
  const [bankReference, setBankReference] = useState("");

  // Delete Confirmation Modal States
  const [isDeleteConfirmationModalOpen, setIsDeleteConfirmationModalOpen] =
    useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteMessage, setDeleteMessage] = useState("");
  const [isDeleteSuccess, setIsDeleteSuccess] = useState(false);

  // Edit Order Modal States
  const [isEditOrderModalOpen, setIsEditOrderModalOpen] = useState(false);
  const [orderToEdit, setOrderToEdit] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editMessage, setEditMessage] = useState("");
  const [isEditSuccess, setIsEditSuccess] = useState(false);
  const [editOrderCart, setEditOrderCart] = useState({
    type: "normal",
    items: [],
    offer: null,
    offerCount: 0,
  });
  const [availableRestaurantMenus, setAvailableRestaurantMenus] = useState([]);
  const [fetchingMenusForEdit, setFetchingMenusForEdit] = useState(false);
  const [menusForEditError, setMenusForEditError] = useState(null);

  // NEW: Bill Calculator Modal States
  const [isCalculatorModalOpen, setIsCalculatorModalOpen] = useState(false);
  const [orderToCalculate, setOrderToCalculate] = useState(null);
  const [calculatorNumPeople, setCalculatorNumPeople] = useState(1);
  const [peopleShares, setPeopleShares] = useState([]); // Array of { id, name, assignedItems: [{ item, quantity }], total }
  const [availableItemsForSplit, setAvailableItemsForSplit] = useState([]); // Items from order with mutable quantities

  // Fetch orders on component mount or USER_ID change
  useEffect(() => {
    if (USER_ID) {
      fetchUserOrders(USER_ID);
    }
  }, [USER_ID]);

  // Fetches user orders from the backend API.
  const fetchUserOrders = async (userId) => {
    setLoadingOrders(true);
    setOrdersError(null);
    try {
      const response = await axiosClient.get(`/orders/user/${userId}`);
      if (response.data.success) {
        setOrders(response.data.data);
      } else {
        setOrdersError(response.data.message || "Failed to fetch orders.");
      }
    } catch (err) {
      setOrdersError(err.message || "Network error fetching orders.");
      console.error("Error fetching orders:", err);
    } finally {
      setLoadingOrders(false);
    }
  };

  // Fetches the user's current wallet balance from the backend.
  const fetchUserWalletBalance = async (userId) => {
    if (!userId) return;
    setWalletBalanceLoading(true);
    try {
      const response = await axiosClient.get(`/payments/user-balance/${userId}`);
      if (response.data.success) {
        setUserWalletBalance(parseFloat(response.data.balance).toFixed(2));
      } else {
        console.error("Failed to fetch wallet balance:", response.data.message);
        setUserWalletBalance("Error");
      }
    } catch (err) {
      console.error("Network error fetching wallet balance:", err);
      setUserWalletBalance("Error");
    } finally {
      setWalletBalanceLoading(false);
    }
  };

  // Fetch restaurant menus for edit modal
  const fetchRestaurantMenusForEdit = async (restaurantId) => {
    setFetchingMenusForEdit(true);
    setMenusForEditError(null);
    try {
      const response = await axiosClient.get(
        `/menus/restaurant/${restaurantId}`
      );
      setAvailableRestaurantMenus(response.data.data);
    } catch (err) {
      setMenusForEditError(
        err.message || "Failed to load restaurant menus for editing."
      );
      console.error("Error fetching menus for edit:", err);
    } finally {
      setFetchingMenusForEdit(false);
    }
  };

  // --- Payment Handlers ---
  const openPaymentModal = (order) => {
    setSelectedOrderForPayment(order);
    setPaymentMethod("");
    setPaymentMessage("");
    setIsPaymentSuccess(false);
    setTopUpAmount("");
    setTopUpMessage("");
    setCardCode(""); // Reset card code
    setBankReference(""); // Reset bank reference
    setIsPaymentModalOpen(true);
    document.body.style.overflow = "hidden";
    if (USER_ID) {
      fetchUserWalletBalance(USER_ID);
    }
  };

  const closePaymentModal = () => {
    setIsPaymentModalOpen(false);
    setSelectedOrderForPayment(null);
    document.body.style.overflow = "unset";
    fetchUserOrders(USER_ID);
  };

  const handleProcessPayment = async () => {
    if (!selectedOrderForPayment || !paymentMethod) {
      setPaymentMessage("Please select a payment method.");
      setIsPaymentSuccess(false);
      return;
    }

    if (paymentMethod === "credit_card" && !cardCode) {
      setPaymentMessage("Please enter the card code.");
      setIsPaymentSuccess(false);
      return;
    }
    if (paymentMethod === "bank_transfer" && !bankReference) {
      setPaymentMessage("Please enter the bank reference.");
      setIsPaymentSuccess(false);
      return;
    }
    if (paymentMethod === "wallet" && parseFloat(userWalletBalance) < selectedOrderForPayment.price) {
      setPaymentMessage("Insufficient wallet balance for this order. Please top up.");
      setIsPaymentSuccess(false);
      return;
    }

    const payload = {
      order_id: selectedOrderForPayment.id,
      payment_method: paymentMethod,
      ...(paymentMethod === "credit_card" && { card_code: cardCode }),
      ...(paymentMethod === "bank_transfer" && { bank_reference: bankReference }),
    };

    setPaymentLoading(true);
    setPaymentMessage("");
    try {
      const response = await axiosClient.post("/payments/processPayment", payload);
      if (response.data.success) {
        setPaymentMessage(response.data.message || "Payment processed successfully!");
        setIsPaymentSuccess(true);
        if (paymentMethod === 'wallet') {
          fetchUserWalletBalance(USER_ID);
        }
      } else {
        setPaymentMessage(response.data.message || "Payment failed.");
        setIsPaymentSuccess(false);
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error processing payment.";
      setPaymentMessage(msg);
      setIsPaymentSuccess(false);
      console.error("Payment API error:", err);
    } finally {
      setPaymentLoading(false);
    }
  };

  const handleTopUpWallet = async () => {
    if (!USER_ID) {
      setTopUpMessage("User not logged in.");
      return;
    }
    const amount = parseFloat(topUpAmount);
    if (isNaN(amount) || amount <= 0) {
      setTopUpMessage("Please enter a valid amount to top up.");
      return;
    }

    setTopUpLoading(true);
    setTopUpMessage("");

    try {
      const response = await axiosClient.post("/payments/topUpWallet", {
        user_id: USER_ID,
        amount: amount,
      });

      if (response.data.success) {
        setTopUpMessage(response.data.message || "Wallet topped up successfully!");
        setUserWalletBalance(parseFloat(response.data.new_balance).toFixed(2));
        setTopUpAmount("");
      } else {
        setTopUpMessage(response.data.message || "Failed to top up wallet.");
      }
    } catch (err) {
      const msg = err.response?.data?.message || err.message || "Error topping up wallet.";
      setTopUpMessage(msg);
      console.error("Top-up API error:", err);
    } finally {
      setTopUpLoading(false);
    }
  };

  // --- Delete Handlers ---
  const openDeleteConfirmation = (order) => {
    setOrderToDelete(order);
    setDeleteMessage("");
    setIsDeleteSuccess(false);
    setIsDeleteConfirmationModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeDeleteConfirmationModal = () => {
    setIsDeleteConfirmationModalOpen(false);
    setOrderToDelete(null);
    document.body.style.overflow = "unset";
    fetchUserOrders(USER_ID);
  };

  const confirmDeleteOrder = async () => {
    if (!orderToDelete) return;

    setDeleteLoading(true);
    setDeleteMessage("");

    try {
      const response = await axiosClient.delete(`/orders/${orderToDelete.id}`);
      if (response.data.success) {
        setDeleteMessage(
          response.data.message || "Order deleted successfully!"
        );
        setIsDeleteSuccess(true);
      } else {
        setDeleteMessage(response.data.message || "Failed to delete order.");
        setIsDeleteSuccess(false);
      }
    } catch (err) {
      const msg =
        err.response?.data?.message || err.message || "Error deleting order.";
      setDeleteMessage(msg);
      setIsDeleteSuccess(false);
    } finally {
      setDeleteLoading(false);
    }
  };

  // --- Edit Order Handlers ---
  const openEditOrderModal = (order) => {
    setOrderToEdit(order);
    if (order.offer_id === null && order.details) {
      setEditOrderCart({
        type: "normal",
        items: order.details.map((detail) => ({
          id: detail.menu_items_id,
          menu_items_id: detail.menu_items_id,
          name: detail.menu_item?.name || "Unknown Item",
          price: parseFloat(detail.price),
          quantity: detail.quantity,
          menuName: detail.menu_item?.menu?.name || "Unknown Menu",
        })),
        offer: null,
        offerCount: 0,
      });
    } else if (order.offer_id !== null && order.offer) {
      setEditOrderCart({
        type: "offer",
        items: [],
        offer: order.offer,
        offerCount: order.offer_count || 1,
      });
    } else {
      setEditOrderCart({
        type: "normal",
        items: [],
        offer: null,
        offerCount: 0,
      });
    }

    if (order.restaurants_id) {
      fetchRestaurantMenusForEdit(order.restaurants_id);
    }

    setEditMessage("");
    setIsEditSuccess(false);
    setIsEditOrderModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeEditOrderModal = () => {
    setIsEditOrderModalOpen(false);
    setOrderToEdit(null);
    setAvailableRestaurantMenus([]);
    document.body.style.overflow = "unset";
    fetchUserOrders(USER_ID);
  };

  const handleAddItemToEditOrder = (item, menuName) => {
    setEditOrderCart((prevCart) => {
      if (prevCart.type === "offer" && prevCart.offer !== null) {
        return {
          type: "normal",
          items: [{ ...item, quantity: 1, menuName, menu_items_id: item.id }],
          offer: null,
          offerCount: 0,
        };
      }

      const existingItemIndex = prevCart.items.findIndex(
        (cartItem) => cartItem.menu_items_id === item.id
      );

      if (existingItemIndex > -1) {
        const updatedItems = [...prevCart.items];
        updatedItems[existingItemIndex].quantity += 1;
        return { ...prevCart, items: updatedItems };
      } else {
        return {
          ...prevCart,
          type: "normal",
          items: [
            ...prevCart.items,
            { ...item, quantity: 1, menuName, menu_items_id: item.id },
          ],
        };
      }
    });
  };

  const handleApplyOfferToEditCart = (offer) => {
    setEditOrderCart((prevCart) => {
      if (prevCart.type === "normal" && prevCart.items.length > 0) {
        return {
          type: "offer",
          items: [],
          offer: offer,
          offerCount: 1,
        };
      }
      if (
        prevCart.type === "offer" &&
        prevCart.offer &&
        prevCart.offer.id === offer.id
      ) {
        return prevCart;
      }
      return { ...prevCart, type: "offer", offer: offer, offerCount: 1 };
    });
  };

  const handleEditQuantityChange = (type, id, change) => {
    setEditOrderCart((prevCart) => {
      if (type === "item") {
        const updatedItems = prevCart.items
          .map(
            (item) =>
              item.menu_items_id === id
                ? { ...item, quantity: Math.max(0, item.quantity + change) }
                : item
          )
          .filter((item) => item.quantity > 0);
        return {
          ...prevCart,
          items: updatedItems,
          type: updatedItems.length > 0 ? "normal" : "empty",
        };
      } else if (type === "offer") {
        const newOfferCount = Math.max(0, prevCart.offerCount + change);
        return {
          ...prevCart,
          offerCount: newOfferCount,
          type: newOfferCount > 0 ? "offer" : "empty",
          offer: newOfferCount === 0 ? null : prevCart.offer,
        };
      }
      return prevCart;
    });
  };

  const calculateEditOrderTotal = () => {
    if (editOrderCart.type === "offer" && editOrderCart.offer) {
      return editOrderCart.offer.fixed_price * editOrderCart.offerCount;
    }
    return editOrderCart.items.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  };

  const handleSaveOrderChanges = async () => {
    if (!orderToEdit) return;

    if (
      (editOrderCart.type === "normal" && editOrderCart.items.length === 0) ||
      (editOrderCart.type === "offer" && editOrderCart.offer === null)
    ) {
      setEditMessage("Your order is empty. Please add items or an offer.");
      setIsEditSuccess(false);
      return;
    }

    setEditLoading(true);
    setEditMessage("");

    let payload = {
      status: orderToEdit.status,
      restaurants_id: orderToEdit.restaurants_id,
      price: calculateEditOrderTotal(),
    };

    if (editOrderCart.type === "offer" && editOrderCart.offer) {
      payload.type = "offer";
      payload.offer_id = editOrderCart.offer.id;
      payload.offer_count = editOrderCart.offerCount;
      payload.items = [];
    } else if (
      editOrderCart.type === "normal" &&
      editOrderCart.items.length > 0
    ) {
      payload.type = "normal";
      payload.items = editOrderCart.items.map((item) => ({
        menu_items_id: item.menu_items_id,
        quantity: item.quantity,
      }));
      payload.offer_id = null;
      payload.offer_count = 0;
    } else {
      setEditMessage("Invalid order type or empty cart.");
      setIsEditSuccess(false);
      setEditLoading(false);
      return;
    }

    let response;
    try {
      response = await axiosClient.post(
        `/orders/updateOrder/${orderToEdit.id}`,
        payload
      );
      if (response.data.success) {
        setEditMessage(response.data.message || "Order updated successfully!");
        setIsEditSuccess(true);
      } else {
        setEditMessage(response.data.message || "Failed to update order.");
        setIsEditSuccess(false);
      }
    } catch (apiError) {
      const msg =
        apiError.response?.data?.message ||
        apiError.message ||
        "Error updating order.";
      setEditMessage(msg);
      setIsEditSuccess(false);
      console.error("Update Order API error:", apiError);
    } finally {
      setEditLoading(false);
      if (response && response.data.success) {
        setTimeout(closeEditOrderModal, 1500);
      }
    }
  };

  // --- Bill Calculator Handlers ---
  const openSplitBillModal = (order) => {
    // Only allow splitting normal orders with items
    if (!order.details || order.details.length === 0) {
      alert("Only orders with specific menu items can be split."); // In production, use a custom modal message.
      return;
    }

    setOrderToCalculate(order);
    setCalculatorNumPeople(1); // Default to 1 person

    const initialSplittableItems = order.details.flatMap((detail, detailIndex) =>
      Array.from({ length: detail.quantity }).map((_, qIndex) => ({
        portion_id: `${detail.menu_items_id}-${detailIndex}-${qIndex}`,
        menu_item_id: detail.menu_items_id,
        name: detail.menu_item?.name || "Unknown Item",
        price: parseFloat(detail.price),
        isAssigned: false,
      }))
    );
    setAvailableItemsForSplit(initialSplittableItems);

    setPeopleShares([{ id: 0, name: "Person 1", assignedItems: [], total: 0 }]);
    setIsCalculatorModalOpen(true);
    document.body.style.overflow = "hidden";
  };

  const closeSplitBillModal = () => {
    setIsCalculatorModalOpen(false);
    setOrderToCalculate(null);
    setCalculatorNumPeople(1);
    setPeopleShares([]);
    setAvailableItemsForSplit([]);
    document.body.style.overflow = "unset";
  };

  const handleCalculatorNumPeopleChange = (e) => {
    const num = Math.max(1, parseInt(e.target.value) || 1);
    setCalculatorNumPeople(num);

    const newPeopleShares = Array.from({ length: num }).map((_, index) => {
      const person = peopleShares[index] || { id: index, name: `Person ${index + 1}`, assignedItems: [], total: 0 };
      return { ...person, assignedItems: [], total: 0 };
    });
    setPeopleShares(newPeopleShares);

    setAvailableItemsForSplit(prevItems => prevItems.map(item => ({ ...item, isAssigned: false })));
  };

  const handleAssignItemToPerson = (personIndex, portionId) => {
    setAvailableItemsForSplit(prevAvailable => {
      const updatedAvailable = prevAvailable.map(item =>
        item.portion_id === portionId ? { ...item, isAssigned: true } : item
      );

      setPeopleShares(prevShares => {
        const itemToAssign = updatedAvailable.find(item => item.portion_id === portionId);
        if (!itemToAssign) return prevShares;

        const newShares = [...prevShares];
        const targetPerson = { ...newShares[personIndex] };

        targetPerson.assignedItems = [...targetPerson.assignedItems, { ...itemToAssign, originalPortionId: itemToAssign.portion_id }];
        targetPerson.total = (targetPerson.total + itemToAssign.price);

        newShares[personIndex] = targetPerson;
        return newShares;
      });

      return updatedAvailable;
    });
  };

  const handleRemoveAssignedItemFromPerson = (personIndex, portionIdToRemove) => {
    setPeopleShares(prevShares => {
      const newShares = [...prevShares];
      const targetPerson = { ...newShares[personIndex] };

      const itemIndexToRemove = targetPerson.assignedItems.findIndex(item => item.originalPortionId === portionIdToRemove);
      if (itemIndexToRemove === -1) return prevShares;

      const itemRemoved = targetPerson.assignedItems[itemIndexToRemove];
      targetPerson.assignedItems = targetPerson.assignedItems.filter((_, index) => index !== itemIndexToRemove);
      targetPerson.total = Math.max(0, targetPerson.total - itemRemoved.price);

      newShares[personIndex] = targetPerson;
      return newShares;
    });

    setAvailableItemsForSplit(prevAvailable => {
      return prevAvailable.map(item =>
        item.portion_id === portionIdToRemove ? { ...item, isAssigned: false } : item
      );
    });
  };

  const calculateRemainingOrderTotal = () => {
    return availableItemsForSplit.reduce((total, item) => {
      return total + (item.isAssigned ? 0 : item.price);
    }, 0);
  };


  if (loadingOrders)
    return <div className="mo-loading-message">Loading your orders...</div>;
  if (ordersError)
    return <div className="mo-error-message">Error: {ordersError}</div>;

  return (
    <div className="mo-page-container">
      <div className="mo-header">
        <h1>My Orders</h1>
        <p>Review your past and pending orders</p>
      </div>

      {orders.length === 0 ? (
        <div className="mo-no-orders-found">
          <h3>No orders found</h3>
          <p>You haven't placed any orders yet.</p>
          <p>Let me move you to make your first order😋</p>
          <Link to="/Resturants" className="mo-action-button mo-browse-button">
            Start Ordering
          </Link>
        </div>
      ) : (
        <div className="mo-orders-grid">
          {orders.map((order) => (
            <div key={order.id} className="mo-order-card">
              <div className="mo-order-summary">
                <p>
                  Order ID: <strong>{order.id}</strong>
                </p>
                <p>
                  Restaurant: <strong>{order.restaurant?.name || "N/A"}</strong>
                </p>
                <p>
                  Type: <strong>{order.type}</strong>
                </p>
                <p>
                  Total Price:{" "}
                  <strong>${parseFloat(order.price).toFixed(2)}</strong>
                </p>
                <p>
                  Status:{" "}
                  <span className={`mo-order-status ${order.status}`}>
                    {order.status}
                  </span>
                </p>
                <p>
                  Ordered On: {new Date(order.created_at).toLocaleDateString()}
                </p>
              </div>

              {order.details && order.details.length > 0 && (
                <div className="mo-order-details-section">
                  <h4>Items:</h4>
                  <ul className="mo-order-items-list">
                    {order.details.map((detail) => (
                      <li key={detail.id} className="mo-order-item-detail">
                        <strong>
                          {detail.menu_item?.name || "Unknown Item"}
                        </strong>{" "}
                        (x{detail.quantity}) - $
                        {parseFloat(detail.price).toFixed(2)} each
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="mo-order-actions">
                {order.status === "pending" && (
                  <button
                    className="mo-action-button mo-edit-order-button"
                    onClick={() => openEditOrderModal(order)}
                  >
                    <Edit size={18} /> Edit
                  </button>
                )}
                {order.status !== "completed" && (
                  <button
                    className="mo-action-button mo-delete-order-button"
                    onClick={() => openDeleteConfirmation(order)}
                    disabled={deleteLoading}
                  >
                    <Trash2 size={18} /> Delete
                  </button>
                )}
                {order.status !== "completed" && (
                  <button
                    className="mo-action-button mo-payment-button"
                    onClick={() => openPaymentModal(order)}
                    disabled={paymentLoading}
                  >
                    <DollarSign size={18} /> Process Payment
                  </button>
                )}
                {/* Split Bill Button */}
                {order.details && order.details.length > 0 && order.status !== "completed" && (
                  <button
                    className="mo-action-button mo-split-bill-button"
                    onClick={() => openSplitBillModal(order)}
                  >
                    <Calculator size={18} /> Split Bill
                  </button>
                )}
                {order.status === "completed" && (
                  <span className="mo-order-completed-message">
                    Payment Completed
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Payment Modal */}
      {isPaymentModalOpen && selectedOrderForPayment && (
        <div className={`mo-modal-overlay-custom ${isPaymentModalOpen ? 'open' : ''}`} onClick={closePaymentModal}>
          <div
            className="mo-modal-content mo-small-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mo-modal-close-button"
              onClick={closePaymentModal}
            >
              <X size={24} />
            </button>
            <h2 className="mo-modal-title">
              Process Payment for Order #{selectedOrderForPayment.id}
            </h2>
            <p className="mo-payment-total">
              Amount to Pay:{" "}
              <strong>
                ${parseFloat(selectedOrderForPayment.price).toFixed(2)}
              </strong>
            </p>

            {/* Wallet Balance Display */}
            <div className="mo-wallet-balance-display">
              <span>
                <Wallet size={20} /> Your Wallet Balance:
              </span>
              {walletBalanceLoading ? (
                <Loader className="spinner" size={20} />
              ) : (
                <strong>
                  ${userWalletBalance}
                </strong>
              )}
            </div>

            <div className="mo-payment-method-options">
              <h3>Select Payment Method:</h3>
              <div className="mo-payment-method-options-grid"> {/* NEW: Custom class for grid */}
                <label className="mo-payment-option-label"> {/* NEW: Custom class */}
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={paymentMethod === "credit_card"}
                    onChange={(e) => {setPaymentMethod(e.target.value); setCardCode('');}}
                    className="mo-payment-radio" 
                  />
                  <span>Credit Card</span>
                </label>
                {/* <label className="mo-payment-option-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cash"
                    checked={paymentMethod === "cash"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    className="mo-payment-radio"
                  />{" "}
                  <span>Cash</span>
                </label> */}
                {/* <label
                  className={`mo-payment-option-label ${
                    parseFloat(userWalletBalance) < selectedOrderForPayment.price
                      ? "mo-disabled-option"
                      : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="wallet"
                    checked={paymentMethod === "wallet"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled={parseFloat(userWalletBalance) < selectedOrderForPayment.price}
                    className="mo-payment-radio"
                  />{" "}
                  <span>Wallet</span>
                  {parseFloat(userWalletBalance) < selectedOrderForPayment.price && (
                    <span className="mo-insufficient-funds-text">(Insufficient Funds)</span>
                  )}
                </label> */}
                <label className="mo-payment-option-label">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="bank_transfer"
                    checked={paymentMethod === "bank_transfer"}
                    onChange={(e) => {setPaymentMethod(e.target.value); setBankReference('');}}
                    className="mo-payment-radio"
                  />{" "}
                  <span>Bank Transfer</span>
                </label>
              </div>
            </div>

            {paymentMethod === "credit_card" && (
                <div className="mo-payment-input-group">
                    <label htmlFor="cardCode">Card Code:</label>
                    <input
                        type="text"
                        id="cardCode"
                        value={cardCode}
                        onChange={(e) => setCardCode(e.target.value)}
                        className="mo-payment-input"
                        placeholder="Enter card code"
                    />
                </div>
            )}
            {paymentMethod === "bank_transfer" && (
                <div className="mo-payment-input-group">
                    <label htmlFor="bankReference">Bank Reference:</label>
                    <input
                        type="text"
                        id="bankReference"
                        value={bankReference}
                        onChange={(e) => setBankReference(e.target.value)}
                        className="mo-payment-input"
                        placeholder="Enter bank reference"
                    />
                </div>
            )}

            {/* Top Up Wallet Section */}
            {/* <div className="mo-top-up-wallet-section">
              <h3>Top Up Wallet</h3>
              <div className="mo-top-up-wallet-controls">
                <input
                  type="number"
                  placeholder="Amount to top up"
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="mo-top-up-input"
                  min="0.01"
                  step="0.01"
                />
                <button
                  onClick={handleTopUpWallet}
                  disabled={topUpLoading || !topUpAmount || parseFloat(topUpAmount) <= 0}
                  className="mo-top-up-wallet-button"
                >
                  {topUpLoading ? (
                    <Loader className="spinner" size={20} />
                  ) : (
                    <>
                      <Plus size={20} /> Top Up
                    </>
                  )}
                </button>
              </div>
              {topUpMessage && (
                <p className="mo-message-container success">{topUpMessage}</p> 
              )}
            </div> */}

            {paymentMessage && (
              <p
                className={`mo-message-container ${
                  isPaymentSuccess ? "success" : "error"
                }`}
              >
                {isPaymentSuccess ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}{" "}
                {paymentMessage}
              </p>
            )}

            <div className="mo-modal-actions">
              <button
                className="mo-action-button mo-cancel-button"
                onClick={closePaymentModal}
                disabled={paymentLoading || topUpLoading}
              >
                Cancel
              </button>
              <button
                className="mo-action-button mo-process-payment-button"
                onClick={handleProcessPayment}
                disabled={paymentLoading || !paymentMethod || (paymentMethod === "wallet" && parseFloat(userWalletBalance) < selectedOrderForPayment.price) || (paymentMethod === "credit_card" && !cardCode) || (paymentMethod === "bank_transfer" && !bankReference)}
              >
                {paymentLoading ? (
                  <Loader className="spinner" size={20} />
                ) : (
                  "Pay Now"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteConfirmationModalOpen && orderToDelete && (
        <div
          className={`mo-modal-overlay-custom ${isDeleteConfirmationModalOpen ? 'open' : ''}`}
          onClick={closeDeleteConfirmationModal}
        >
          <div
            className="mo-modal-content mo-small-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mo-modal-close-button"
              onClick={closeDeleteConfirmationModal}
            >
              <X size={24} />
            </button>
            <h2 className="mo-modal-title">Confirm Deletion</h2>
            <p className="mo-delete-message">
              Are you sure you want to delete Order <strong>#{orderToDelete.id}</strong>? This action cannot be undone.
            </p>

            {deleteMessage && (
              <p
                className={`mo-message-container ${
                  isDeleteSuccess ? "success" : "error"
                }`}
              >
                {isDeleteSuccess ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}{" "}
                {deleteMessage}
              </p>
            )}

            <div className="mo-modal-actions">
              <button
                className="mo-action-button mo-cancel-button"
                onClick={closeDeleteConfirmationModal}
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                className="mo-action-button mo-delete-confirm-button"
                onClick={confirmDeleteOrder}
                disabled={deleteLoading}
              >
                {deleteLoading ? (
                  <Loader className="spinner" size={20} />
                ) : (
                  "Delete"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Order Modal */}
      {isEditOrderModalOpen && orderToEdit && (
        <div className={`mo-modal-overlay-custom ${isEditOrderModalOpen ? 'open' : ''}`} onClick={closeEditOrderModal}>
          <div
            className="mo-modal-content mo-large-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mo-modal-close-button"
              onClick={closeEditOrderModal}
            >
              <X size={24} />
            </button>
            <h2 className="mo-modal-title">Edit Order #{orderToEdit.id}</h2>

            {fetchingMenusForEdit ? (
              <div className="mo-loading-message-modal">
                <Loader className="spinner" size={24} /> Loading menus for editing...
              </div>
            ) : menusForEditError ? (
              <div className="mo-error-message-modal">
                <AlertCircle size={24} /> Error loading menus: {menusForEditError}
              </div>
            ) : (
              <>
                {/* Current Order Summary in Edit Modal */}
                <div className="mo-edit-order-current-summary">
                  <h3>Current Order</h3>
                  {editOrderCart.type === "normal" &&
                  editOrderCart.items.length > 0 ? (
                    <ul className="mo-edit-order-current-items-list">
                      {editOrderCart.items.map((item) => (
                        <li
                          key={item.id}
                          className="mo-edit-order-current-item"
                        >
                          <p>
                            {item.name} (x{item.quantity})
                          </p>
                          <div className="mo-item-quantity-controls">
                            <button
                              onClick={() => handleEditQuantityChange("item", item.id, -1)}
                              className="mo-quantity-button"
                            >
                              <Minus size={16} />
                            </button>
                            <span className="mo-quantity-display">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleEditQuantityChange("item", item.id, 1)}
                              className="mo-quantity-button"
                            >
                              <Plus size={16} />
                            </button>
                          </div>
                          <span className="mo-item-price-display">
                            ${(item.price * item.quantity).toFixed(2)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : editOrderCart.type === "offer" && editOrderCart.offer ? (
                    <div className="mo-edit-order-current-offer">
                      <p>
                        Offer: {editOrderCart.offer.title} (x
                        {editOrderCart.offerCount})
                      </p>
                      <div className="mo-item-quantity-controls">
                        <button
                          onClick={() =>
                            handleEditQuantityChange(
                              "offer",
                              editOrderCart.offer.id,
                              -1
                            )
                          }
                          className="mo-quantity-button"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="mo-quantity-display">
                          {editOrderCart.offerCount}
                        </span>
                        <button
                          onClick={() =>
                            handleEditQuantityChange(
                              "offer",
                              editOrderCart.offer.id,
                              1
                            )
                          }
                          className="mo-quantity-button"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      <span className="mo-item-price-display">
                        $
                        {(
                          editOrderCart.offer.fixed_price *
                          editOrderCart.offerCount
                        ).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <p className="mo-no-items-in-cart">
                      No items or offers currently in order.
                    </p>
                  )}
                  <p className="mo-edit-order-total">
                    Total:{" "}
                    <strong>${calculateEditOrderTotal().toFixed(2)}</strong>
                  </p>
                </div>

                <div className="mo-edit-order-add-section">
                  <h3>Add/Modify Order Items</h3>

                  {fetchingMenusForEdit ? (
                    <p className="mo-loading-message-modal">
                      <Loader className="spinner" size={24} /> Loading menus for editing...
                    </p>
                  ) : menusForEditError ? (
                    <p className="mo-error-message-modal">
                      <AlertCircle size={24} /> Error loading menus: {menusForEditError}
                    </p>
                  ) : availableRestaurantMenus.length > 0 ? (
                    <div className="mo-edit-order-menus-container">
                      {availableRestaurantMenus.map((menu) => (
                        <div key={menu.id} className="mo-edit-order-menu-card">
                          <h4>{menu.name}</h4>
                          {menu.items && menu.items.length > 0 ? (
                            <ul className="mo-edit-order-menu-items-list">
                              {menu.items.map((item) => (
                                <li
                                  key={item.id}
                                  className="mo-edit-order-menu-item"
                                >
                                  <span>
                                    {item.name} - $
                                    {parseFloat(item.price).toFixed(2)}
                                  </span>
                                  <button
                                    className="mo-action-button mo-add-item-small-button"
                                    onClick={() =>
                                      handleAddItemToEditOrder(item, menu.name)
                                    }
                                  >
                                    <Plus size={16} /> Add
                                  </button>
                                </li>
                              ))}
                            </ul>
                          ) : (
                            <p className="mo-no-items-in-menu">
                              No items in this menu.
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="mo-no-menus-available-message">
                      No menus found for this restaurant.
                    </p>
                  )}

                  {orderToEdit.restaurant?.offer &&
                    orderToEdit.restaurant.offer.length > 0 && (
                      <div className="mo-edit-order-offers-container">
                        <h4>Available Offers</h4>
                        <ul className="mo-edit-order-offers-list">
                          {orderToEdit.restaurant.offer.map((offer) => (
                            <li
                              key={offer.id}
                              className="mo-edit-order-offer-item"
                            >
                              <span>
                                {offer.title} - $
                                {parseFloat(offer.fixed_price).toFixed(2)}
                              </span>
                              <button
                                className="mo-action-button mo-apply-offer-small-button"
                                onClick={() =>
                                  handleApplyOfferToEditCart(offer)
                                }
                              >
                                Apply
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                </div>
              </>
            )}

            {editMessage && (
              <p
                className={`mo-submission-message ${
                  isEditSuccess ? "success" : "error"
                }`}
              >
                {isEditSuccess ? (
                  <CheckCircle size={18} />
                ) : (
                  <AlertCircle size={18} />
                )}{" "}
                {editMessage}
              </p>
            )}

            <div className="mo-modal-actions">
              <button
                className="mo-action-button mo-cancel-button"
                onClick={closeEditOrderModal}
                disabled={editLoading}
              >
                Cancel
              </button>
              <button
                className="mo-action-button mo-save-changes-button"
                onClick={handleSaveOrderChanges}
                disabled={
                  editLoading ||
                  (editOrderCart.items.length === 0 &&
                    editOrderCart.offer === null)
                }
              >
                {editLoading ? (
                  <Loader className="spinner" size={20} />
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bill Calculator Modal */}
      {isCalculatorModalOpen && orderToCalculate && (
        <div className={`mo-modal-overlay-custom ${isCalculatorModalOpen ? 'open' : ''}`} onClick={closeSplitBillModal}>
          <div
            className="mo-modal-content mo-calculator-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="mo-modal-close-button"
              onClick={closeSplitBillModal}
            >
              <X size={24} />
            </button>
            <h2 className="mo-modal-title">Split Bill for Order #{orderToCalculate.id}</h2>
            <p className="mo-calculator-order-total">
              Order Total:{" "}
              <strong>
                ${parseFloat(orderToCalculate.price).toFixed(2)}
              </strong>
            </p>

            <div className="mo-calculator-num-people-control">
              <label htmlFor="numPeople" className="mo-calculator-label">
                <Users size={20} /> Number of People:
              </label>
              <input
                type="number"
                id="numPeople"
                min="1"
                value={calculatorNumPeople}
                onChange={handleCalculatorNumPeopleChange}
                className="mo-calculator-input"
              />
            </div>

            <div className="mo-calculator-columns-grid">
              {/* Left Column: Available Items */}
              <div className="mo-calculator-column mo-available-items-column">
                <h3 className="mo-calculator-column-title">Available Items</h3>
                {availableItemsForSplit.filter(item => !item.isAssigned).length === 0 ? (
                  <p className="mo-calculator-empty-message">All items have been assigned.</p>
                ) : (
                  <ul className="mo-available-items-list"> {/* NEW: Class for available items list */}
                    {availableItemsForSplit.map((item) => (
                      !item.isAssigned && (
                        <li key={item.portion_id} className="mo-calculator-item">
                          <span>
                            {item.name} - ${item.price.toFixed(2)}
                          </span>
                          <div className="mo-assign-buttons-group">
                            {peopleShares.map((person, personIndex) => (
                                <button
                                    key={person.id}
                                    onClick={() => handleAssignItemToPerson(personIndex, item.portion_id)}
                                    className="mo-assign-person-button"
                                    title={`Assign to Person ${personIndex + 1}`}
                                >
                                    P{personIndex + 1}
                                </button>
                            ))}
                          </div>
                        </li>
                      )
                    ))}
                  </ul>
                )}
                {calculateRemainingOrderTotal() > 0 && (
                  <p className="mo-calculator-remaining-total">
                    Remaining:{" "}
                    <strong>${calculateRemainingOrderTotal().toFixed(2)}</strong>
                  </p>
                )}
              </div>

              {/* Right Column: People's Shares */}
              <div className="mo-calculator-column mo-person-share-column"> {/* NEW: Class for person share column */}
                <h3 className="mo-calculator-column-title">Who Pays What</h3>
                {peopleShares.length === 0 ? (
                  <p className="mo-calculator-empty-message">Set number of people to start.</p>
                ) : (
                  <div className="mo-person-share-card-container">
                    {peopleShares.map((person, index) => (
                      <div key={person.id} className="mo-person-share-card">
                        <h4 className="mo-person-share-card-title">Person {index + 1}</h4> {/* NEW: Class for person title */}
                        {person.assignedItems.length === 0 ? (
                          <p className="mo-person-empty-items-message">No items assigned yet.</p>
                        ) : (
                          <ul className="mo-person-items-list">
                            {person.assignedItems.map((assignedItem) => (
                              <li key={assignedItem.originalPortionId} className="mo-person-item-detail">
                                <span>{assignedItem.name} - ${assignedItem.price.toFixed(2)}</span>
                                <button
                                  onClick={() => handleRemoveAssignedItemFromPerson(index, assignedItem.originalPortionId)}
                                  className="mo-remove-item-button"
                                  title="Remove item"
                                >
                                  <X size={14} />
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                        <p className="mo-person-total">
                          Total:{" "}
                          <strong>${person.total.toFixed(2)}</strong>
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="mo-modal-actions">
              <button
                className="mo-action-button mo-cancel-button"
                onClick={closeSplitBillModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
