import { createContext, useEffect, useState } from "react";
import {
  addToCart,
  getCartData,
  removeQtyFromCart,
  clearCartItems
} from "../Service/cartService";
import { fetchFoodList } from "../Service/FoodService";

export const StoreContext = createContext(null);

export const StoreContextProvider = ({ children }) => {
  const [foodList, setFoodList] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [token, setToken] = useState("");

  // Increase quantity of a food item
  const increaseQty = async (foodId) => {
    setQuantities((prev) => ({ ...prev, [foodId]: (prev[foodId] || 0) + 1 }));
    try {
      await addToCart(foodId, token);
    } catch (err) {
      console.error("Failed to add to cart", err);
    }
  };

  // Decrease quantity of a food item
  const decreaseQty = async (foodId) => {
    setQuantities((prev) => ({
      ...prev,
      [foodId]: prev[foodId] > 0 ? prev[foodId] - 1 : 0,
    }));
    try {
      await removeQtyFromCart(foodId, token);
    } catch (err) {
      console.error("Failed to remove quantity from cart", err);
    }
  };

  // Remove item completely from cart
  const removeFromCart = (foodId) => {
    setQuantities((prev) => {
      const updated = { ...prev };
      delete updated[foodId];
      return updated;
    });
  };

  // Load cart data from backend safely
  const loadCartData = async (token) => {
    try {
      const items = await getCartData(token);
      setQuantities(items || {}); // Avoid undefined
    } catch (err) {
      console.error("Failed to load cart data", err);
      setQuantities({});
      // Optional: remove invalid token
      setToken("");
      localStorage.removeItem("token");
    }
  };

  // Clear cart both locally and on server
  const clearCart = async () => {
    try {
      await clearCartItems(token, setQuantities);
    } catch (err) {
      console.error("Failed to clear cart", err);
    }
  };

  const contextValue = {
    foodList,
    quantities,
    increaseQty,
    decreaseQty,
    removeFromCart,
    clearCart,
    token,
    setToken,
    setQuantities,
    loadCartData,
  };

  // Load food list and cart on mount
  useEffect(() => {
    async function initData() {
      try {
        const data = await fetchFoodList();
        setFoodList(data || []);
        const savedToken = localStorage.getItem("token");
        if (savedToken) {
          setToken(savedToken);
          await loadCartData(savedToken);
        }
      } catch (err) {
        console.error("Failed to initialize data", err);
      }
    }
    initData();
  }, []);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};
