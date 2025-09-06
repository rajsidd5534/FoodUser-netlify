import axios from "axios";

const API_URL = "https://fooapi-backend-production.up.railway.app/api/foods";

export const fetchFoodList = async () => {
   try {
    const response = await axios.get(API_URL);
    return response.data;
    
   } catch (error) {
    console.log('Error fetching the food list:' , error);
    throw error;
    
   }
      
  }

 export const fetchFoodDetails = async (id) => {
   try {
      const response = await axios.get(API_URL+"/"+id);
      return response.data;
   } catch (error) {
      log('Error fetching food details:' , error);
      throw error;
   }
   
 }