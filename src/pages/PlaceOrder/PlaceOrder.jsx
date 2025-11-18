import React, { useContext, useState } from "react";
import "./PlaceOrder.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import { calculateCartTotals } from "../../utils/cartUtil";
import { toast } from "react-toastify";
import { RAZORPAY_KEY } from "../../utils/contants";
import { useNavigate } from "react-router-dom";
import {
  createOrder,
  deleteOrder,
  verifyPayment,
} from "../../Service/orderService";
import { clearCartItems } from "../../Service/cartService";

const PlaceOrder = () => {
  const { foodList, quantities, setQuantities, token } =
    useContext(StoreContext);

  const navigate = useNavigate();

  // Safe cartItems
  const cartItems = Array.isArray(foodList)
    ? foodList.filter((food) => quantities?.[food.id] > 0)
    : [];

  const [data, setData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    address: "",
    state: "",
    city: "",
    zip: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (event) => {
    event.preventDefault();

    if (!token) {
      toast.error("Please login to continue.");
      return navigate("/login");
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    // Build order
    const orderData = {
      userAddress: `${data.firstName} ${data.lastName}, ${data.address}, ${data.city}, ${data.state}, ${data.zip}`,
      phoneNumber: data.phoneNumber,
      email: data.email,
      orderedItems: cartItems.map((item) => ({
        foodId: item.id,
        quantity: quantities[item.id],
        price: item.price * quantities[item.id],
        category: item.category,
        imageUrl: item.imageUrl,
        description: item.description,
        name: item.name,
      })),
      amount: total.toFixed(2),
      orderStatus: "Preparing",
    };

    try {
      const response = await createOrder(orderData, token);

      if (response?.razorpayOrderId) {
        initiateRazorpayPayment(response);
      } else {
        toast.error("Unable to place order. Try again.");
      }
    } catch (error) {
      toast.error("Order error. Try again.");
    }
  };

  const initiateRazorpayPayment = (order) => {
    const options = {
      key: RAZORPAY_KEY,
      amount: order.amount,
      currency: "INR",
      name: "Foodies",
      description: "Order Payment",
      order_id: order.razorpayOrderId,
      handler: verifyPaymentHandler,
      prefill: {
        name: `${data.firstName} ${data.lastName}`,
        email: data.email,
        contact: data.phoneNumber,
      },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: () => deleteOrderHandler(order.orderId),
      },
    };

    const razor = new window.Razorpay(options);
    razor.open();
  };

  const verifyPaymentHandler = async (razorpayResponse) => {
    const paymentData = {
      razorpay_payment_id: razorpayResponse.razorpay_payment_id,
      razorpay_order_id: razorpayResponse.razorpay_order_id,
      razorpay_signature: razorpayResponse.razorpay_signature,
    };

    try {
      const success = await verifyPayment(paymentData, token);

      if (success) {
        toast.success("Payment successful!");

        // Navigate first to avoid re-render crash
        navigate("/myorders");

        // Clear cart after redirect
        setTimeout(async () => {
          await clearCartItems(token, setQuantities);
        }, 500);
      } else {
        toast.error("Payment verification failed.");
        navigate("/");
      }
    } catch (error) {
      toast.error("Payment error.");
      navigate("/");
    }
  };

  const deleteOrderHandler = async (orderId) => {
    try {
      await deleteOrder(orderId, token);
    } catch {
      toast.error("Order cancelled.");
    }
  };

  const { subtotal, shipping, tax, total } = calculateCartTotals(
    cartItems,
    quantities
  );

  return (
    <div className="container mt-4">
      <main>
        <div className="py-5 text-center">
          <img
            className="d-block mx-auto"
            src={assets.logo}
            alt=""
            width="98"
            height="98"
          />
        </div>

        <div className="row g-5">
          {/* CART */}
          <div className="col-md-5 col-lg-4 order-md-last">
            <h4 className="d-flex justify-content-between align-items-center mb-3">
              <span className="text-primary">Your cart</span>
              <span className="badge bg-primary rounded-pill">
                {cartItems.length}
              </span>
            </h4>

            <ul className="list-group mb-3">
              {cartItems.map((item) => (
                <li
                  key={item.id}
                  className="list-group-item d-flex justify-content-between lh-sm"
                >
                  <div>
                    <h6 className="my-0">{item.name}</h6>
                    <small className="text-body-secondary">
                      Qty: {quantities[item.id]}
                    </small>
                  </div>
                  <span className="text-body-secondary">
                    ₹{item.price * quantities[item.id]}
                  </span>
                </li>
              ))}

              <li className="list-group-item d-flex justify-content-between">
                <span>Shipping</span>
                <span>₹{subtotal === 0 ? 0 : shipping.toFixed(2)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <span>Tax (10%)</span>
                <span>₹{tax.toFixed(2)}</span>
              </li>

              <li className="list-group-item d-flex justify-content-between">
                <strong>Total</strong>
                <strong>₹{total.toFixed(2)}</strong>
              </li>
            </ul>
          </div>

          {/* BILLING FORM */}
          <div className="col-md-7 col-lg-8">
            <h4 className="mb-3">Billing address</h4>

            <form onSubmit={onSubmitHandler}>
              <div className="row g-3">
                <div className="col-sm-6">
                  <label className="form-label">First name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="firstName"
                    required
                    value={data.firstName}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-sm-6">
                  <label className="form-label">Last name</label>
                  <input
                    type="text"
                    className="form-control"
                    name="lastName"
                    required
                    value={data.lastName}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    name="email"
                    required
                    value={data.email}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Phone Number</label>
                  <input
                    type="number"
                    className="form-control"
                    name="phoneNumber"
                    required
                    value={data.phoneNumber}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-12">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    name="address"
                    required
                    value={data.address}
                    onChange={onChangeHandler}
                  />
                </div>

                <div className="col-md-5">
                  <label className="form-label">State</label>
                  <select
                    className="form-select"
                    name="state"
                    required
                    value={data.state}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Karnataka</option>
                  </select>
                </div>

                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <select
                    className="form-select"
                    name="city"
                    required
                    value={data.city}
                    onChange={onChangeHandler}
                  >
                    <option value="">Choose...</option>
                    <option>Bangalore</option>
                  </select>
                </div>

                <div className="col-md-3">
                  <label className="form-label">Zip</label>
                  <input
                    type="number"
                    className="form-control"
                    name="zip"
                    required
                    value={data.zip}
                    onChange={onChangeHandler}
                  />
                </div>
              </div>

              <hr className="my-4" />

              <button
                className="w-100 btn btn-primary btn-lg"
                type="submit"
              >
                Continue to checkout
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlaceOrder;
