import React, { useEffect, useState, useContext } from "react";
import { StoreContext } from "../../context/StoreContext";
import { assets } from "../../assets/assets";
import "./MyOrders.css";
import { fetchUserOrders } from "../../Service/orderService";

const MyOrders = () => {
  const { token } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await fetchUserOrders(token);

      // ALWAYS ensure it's an array
      setData(Array.isArray(response) ? response : []);
    } catch (error) {
      console.error("Error loading orders:", error);
      setData([]); // prevent crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchOrders();
    }
  }, [token]);

  if (loading) {
    return (
      <div className="container text-center mt-5">
        <h5>Loading your orders...</h5>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="container text-center mt-5">
        <h5>No orders found.</h5>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="py-5 row justify-content-center">
        <div className="col-11 card">
          <table className="table table-responsive">
            <tbody>
              {data.map((order, index) => {
                const items = Array.isArray(order.orderedItems)
                  ? order.orderedItems
                  : [];

                return (
                  <tr key={index}>
                    <td>
                      <img
                        src={assets.delivery}
                        alt=""
                        height={48}
                        width={48}
                      />
                    </td>

                    <td>
                      {items.length > 0
                        ? items
                            .map((item) => `${item.name} x ${item.quantity}`)
                            .join(", ")
                        : "No items"}
                    </td>

                    <td>
                      ₹{order?.amount
                        ? Number(order.amount).toFixed(2)
                        : "0.00"}
                    </td>

                    <td>Items: {items.length}</td>

                    <td className="fw-bold text-capitalize">
                      ● {order.orderStatus || "Pending"}
                    </td>

                    <td>
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={fetchOrders}
                      >
                        <i className="bi bi-arrow-clockwise"></i>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default MyOrders;
