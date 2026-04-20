import React, { useContext } from "react";
import "./FoodDisplay.css";
import { StoreContext } from "../../context/StoreContext";
import FoodItem from "../FoodItem/FoodItem";

export const FoodDisplay = ({category}) => {
  
  const { food_list } = useContext(StoreContext);

  return (
    <div className="food-display" id="food-display">
      <h2>✨ Disfruta los mejores platillos cerca de ti ✨<br /> </h2>
      <div className="food-display-list">
        {food_list.map((item, index) => {
          /*Se filtran los platillos por categoría */
          if(category === "All" || category === item.category){
              return (
                <FoodItem
                  key={index}
                  id={item._id}
                  name={item.name}
                  description={item.description}
                  price={item.price}
                  image={item.image}
                />
              );
          } return null;
          /*Se llaman los datos de los platillos y se renderizan en la pantalla se deja de utilizar por la condicional anterior*/
          /*
          return (
            <FoodItem
              key={index}
              id={item._id}
              name={item.name}
              description={item.description}
              price={item.price}
              image={item.image}
            />
          );*/
          })}
      </div>
    </div>
  );
};
export default FoodDisplay;
