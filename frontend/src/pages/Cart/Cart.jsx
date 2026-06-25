import React, { useContext } from 'react'
import './Cart.css'
import { StoreContext } from '../../context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, url, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();

  const handleClearCart = async () => {
    if (window.confirm("¿Deseas vaciar el carrito?")) {
      await clearCart();
    }
  };

  const hasItems = food_list.some(item => cartItems[item._id] > 0 && item.available);

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-items-title">
          <p>Comida</p>
          <p>Nombre</p>
          <p>Precio</p>
          <p>Cantidad</p>
          <p>Total</p>
          <p>Remover</p>
        </div>
        <br />
        <hr />
        {food_list.map((item) => {
          if (cartItems[item._id] > 0) {
            return (
              <div key={item._id}>
                <div className='cart-items-title cart-items-item'>
                  <img src={url + "/images/" + item.image} alt="" />
                  <p>{item.name}</p>
                  <p>S/{item.price}</p>
                  <p>{cartItems[item._id]}</p>
                  <p>S/{item.price * cartItems[item._id]}</p>
                  <button onClick={() => removeFromCart(item._id)} className="remove-btn">
                    Eliminar
                  </button>
                </div>
                <hr />
              </div>
            );
          }
        })}

        {/* ✅ Mensaje si el carrito está vacío */}
        {!hasItems && (
          <p className="cart-empty">Tu carrito está vacío.</p>
        )}
      </div>

      <div className='cart-bottom'>
        <div className='cart-total'>
          <h2>Total en Carro</h2>
          <div>
            <div className="cart-total-details">
              <p>Subtotal</p>
              <p>S/{getTotalCartAmount()}</p>
            </div>
            <div className="cart-total-details">
              <p>Costo Delivery</p>
              <p>S/{getTotalCartAmount() === 0 ? 0 : 2}</p>
            </div>
            <div className="cart-total-details">
              <b>Total</b>
              <b>S/{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 2}</b>
            </div>
          </div>

          <div className="cart-buttons">
            {/* ✅ Botón cancelar/vaciar carrito */}
            {hasItems && (
              <button onClick={handleClearCart} className="btn-clear-cart">
                Vaciar Carrito
              </button>
            )}
            <button
              onClick={() => navigate('/order')}
              disabled={!hasItems}
            >
              Proceder con la compra
            </button>
          </div>
        </div>

        <div className="cart-promocode">
          <div>
            <p>Si tienes codigo de promocion agregarlo aqui</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='Codigo Promocional' />
              <button>Enviar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;