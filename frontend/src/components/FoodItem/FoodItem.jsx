import React, { useContext } from "react";
import PropTypes from "prop-types";
import "./FoodItem.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";

const FoodItem = ({ id, name, price, description, image }) => {
  const { cartItems, addToCart, removeFromCart, url } = useContext(StoreContext);

  return (
    <div className="food-item">
      <div className="food-item-img-container">
        <img className="food-item-image" src={url + "/images/" + image} alt={name} />
        
        {/* ✅ Condición positiva primero (sin negación) */}
        {cartItems[id]
          ? <div className="food-item-counter">
              <button
                type="button"
                onClick={() => removeFromCart(id)}
                className="icon-btn"
              >
                <img src={assets.remove_icon_red} alt="Eliminar" />
              </button>
              <p>{cartItems[id]}</p>
              <button
                type="button"
                onClick={() => addToCart(id)}
                className="icon-btn"
              >
                <img src={assets.add_icon_green} alt="Agregar más" />
              </button>
            </div>
          : <button
              type="button"
              className="add icon-btn"
              onClick={() => addToCart(id)}
            >
              <img src={assets.add_icon_white} alt="Agregar" />
            </button>
        }
      </div>
      <div className="food-item-info">
        <div className="food-item-name-rating">
          <p>{name}</p>
          <img src={assets.rating_starts} alt="Estrellas" />
        </div>
        <p className="food-item-desc">{description}</p>
        <p className="food-item-price">S/{price}</p>
      </div>
    </div>
  );
};

FoodItem.propTypes = {
  id:          PropTypes.string.isRequired,
  name:        PropTypes.string.isRequired,
  price:       PropTypes.number.isRequired,
  description: PropTypes.string.isRequired,
  image:       PropTypes.string.isRequired,
};

export default FoodItem;