import { createContext, useEffect, useState } from "react";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
} from "../Service/cartService";
import { fetchFoodList } from "../Service/FoodService";

export const StoreContext = createContext(null);

export const StoreContextProvider = (props) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  // Increase quantity
  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));

    if (token) {
      await addToCart(foodId, token);
    }
  };

  // Decrease quantity
  const decreaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));

    if (token) {
      await removeQtyFromCart(foodId, token);
    }
  };

  // Remove item completely
  const removeFromCart = (foodId) => {
    setQuantities((prevQuantities) => {
      const updated = { ...prevQuantities };
      delete updated[foodId];
      return updated;
    });
  };

  // Load cart safely (fixed)
  const loadCartData = async (token) => {
    try {
      const items = await getCartData(token);

      if (!items || typeof items !== "object") {
        setQuantities({});
        return;
      }

      setQuantities(items);
    } catch (error) {
      console.error("Error loading cart data:", error);
      setQuantities({});
    }
  };

  const contextValue = {
    foodList,
    increaseQty,
    decreaseQty,
    quantities,
    removeFromCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
  };

  // Load food list + cart data on startup
  useEffect(() => {
    async function loadData() {
      const data = await fetchFoodList();
      setFoodList(data);

      const storedToken = localStorage.getItem("token");

      if (storedToken) {
        setToken(storedToken);
        await loadCartData(storedToken);
      }
    }

    loadData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {props.children}
    </StoreContext.Provider>
  );
};
