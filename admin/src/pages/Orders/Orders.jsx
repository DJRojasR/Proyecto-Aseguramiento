import React, { useEffect, useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import "./Orders.css";
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../../assets/assets';

const Orders = ({ url }) => {

  const [orders, setOrders] = useState([]);

  const fetchOrders = useCallback(async () => {
    const response = await axios.get(url + "/api/order/list");
    if (response.data.success) {
      setOrders(response.data.data);
    } else {
      toast.error("Error al cargar las ordenes");
    }
  }, [url]);

  const statusHandler = async (event, orderId) => {
    const response = await axios.post(url + "/api/order/status", {
      orderId,
      status: event.target.value
    });
    if (response.data.success) {
      await fetchOrders();
    } else {
      toast.error("Error al actualizar el estado de la orden");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  return (
    <div className="order add">
      <h3>Lista de Ordenes</h3>
      <div className="order-list">
        {orders.map((order) => (  // ✅ removido index
          <div key={order._id} className="order-item"> {/* ✅ key con _id único */}
            <img src={assets.parcel_icon} alt='' />
            <div>
              <p className="order-item-food">
                {order.items.map((item, itemIndex) => {
                  if (itemIndex === order.items.length - 1) {
                    return item.name + " x" + item.quantity;
                  } else {
                    return item.name + " x" + item.quantity + ", ";
                  }
                })}
              </p>
              <p className='order-item-name'>
                {order.address.nombre + " " + order.address.apellido}
              </p>
              <div className='order-item-address'>
                <p>{order.address.direccion + ","}</p>
                <p>{order.address.ciudad + ", " + order.address.distrito + ", " + order.address.pais + ", " + order.address.codigopostal}</p>
              </div>
              <p className='order-item-phone'>
                {order.address.phone}
              </p>
            </div>
            <p>Items: {order.items.length}</p>
            <p>Precio Total: {order.amount} PEN</p>

            <select 
              onChange={(e) => statusHandler(e, order._id)} 
              value={order.status} 
              className="order-item-status"
              disabled={order.status === "Pago Fallido"} // Bloquea si no está pagado
              style={order.status === "Pago Fallido" ? { borderColor: "#d9534f", color: "#d9534f" } : {}}
            >
              {order.status === "Pago Fallido" ? (
                <option value="Pago Fallido">Pago Rechazado</option>
              ) : (
                <>
                  <option value="Food Processing">Preparando</option>
                  <option value="Out for Delivery">Enviando</option>
                  <option value="Delivered">Recibido</option>
                </>
              )}
            </select>
          </div>
        ))}
      </div>
    </div>
  );
};

Orders.propTypes = {
  url: PropTypes.string.isRequired,
};

export default Orders;