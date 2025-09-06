// import axios from "axios";
// const API_URL = "http://localhost:8082/api/cart";

// export const addToCart = async (foodId, token) => {
//  try{
//   await axios.post(
//       API_URL,
//         {foodId},
//         {headers: { Authorization: `Bearer ${token}` }});
//  } catch (error) {
//    console.error("Error adding to cart:", error);
//   }
// }

// export const removeQtyFromCart = async (foodId, token) => {
// try {
//   await axios.post(
//            API_URL+"/remove",
//             {foodId},
//             {headers: { Authorization: `Bearer ${token}` }});
// } catch (error) {
//   console.error("Error removing from cart:", error);
  
//   }
// }


// export const getCartData = async (foodId, token) => {
// try {
//   const response = await  axios.get(
//         API_URL,
//         {headers: { Authorization: `Bearer ${token}` }});
// } catch (error) {
//   console.error("Error fetching cart data:", error);
// }
// }