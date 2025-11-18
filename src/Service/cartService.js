import axios from "axios";
const API_URL = "https://fooapi-backend.onrender.com/api/cart";

// Add Item to Cart
export const addToCart = async (foodId, token) => {
  try {
    await axios.post(
      API_URL,
      { foodId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error while adding item to cart", error);
  }
};

// Remove Item Quantity
export const removeQtyFromCart = async (foodId, token) => {
  try {
    await axios.post(
      `${API_URL}/remove`,
      { foodId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
  } catch (error) {
    console.error("Error while removing qty from cart", error);
  }
};

// Get Cart Data (SAFE VERSION)
export const getCartData = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    // Ensure items ALWAYS returns an object
    return response.data.items || {};
  } catch (error) {
    console.error("Error while fetching cart data", error);

    // Prevent crash by always returning empty object
    return {};
  }
};

// Clear Cart Items
export const clearCartItems = async (token, setQuantities) => {
  try {
    await axios.delete(API_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setQuantities({});
  } catch (error) {
    console.error("Error while clearing the cart", error);
    throw error;
  }
};
