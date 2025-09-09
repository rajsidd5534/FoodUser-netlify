import React, { useContext } from 'react';
import { StoreContext } from '../../context/StoreContext';
import FoodItem from '../../FoodItem/FoodItem';

const FoodDisplay = ({ category, searchText }) => {
  const { foodList } = useContext(StoreContext);

  const filterFood = foodList.filter(
    (food) =>
      (category === 'All' || food.category === category) &&
      food.name.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <div className="container">
      <div className="row">
        {filterFood.length > 0 ? (
          filterFood.map((food, index) => (
            <div key={index} className="col-md-4 mb-4">
              <FoodItem food={food} />
            </div>
          ))
        ) : (
          <p>No food items found.</p>
        )}
      </div>
    </div>
  );
};

export default FoodDisplay;
