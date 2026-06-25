import React, { useContext, useEffect, useState } from 'react';
import "./MyOrders.css";
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const MyOrders = () => {
  const { url, token, food_list } = useContext(StoreContext);
  const [data, setData] = useState([]);
  const [editingOrder, setEditingOrder] = useState(null);
  const [selectedItems, setSelectedItems] = useState({});
  const navigate = useNavigate();

  const fetchOrders = async () => {
  const response = await axios.post(url + "/api/order/userorders", {}, { headers: { token } });
  console.log("Órdenes:", response.data.data); // ✅ ver payment de cada orden
  setData(response.data.data);
};

  useEffect(() => {
    if (token) fetchOrders();
  }, [token]);

  const getStatusLabel = (order) => {
    if (!order.payment) return { label: "Pendiente de pago", color: "#f0ad4e" };
    switch (order.status) {
      case "Food Processing": return { label: "Procesando",   color: "#5bc0de" };
      case "Out for Delivery": return { label: "En camino",   color: "#428bca" };
      case "Delivered":        return { label: "Entregado",   color: "#5cb85c" };
      default:                 return { label: order.status,  color: "#999"    };
    }
  };

  const handleAddItem = (itemId, delta) => {
    setSelectedItems(prev => {
      const current = prev[itemId] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const { [itemId]: _, ...rest } = prev;
        return rest;
      }
      return { ...prev, [itemId]: next };
    });
  };

  const handleSubmitEdit = async (orderId) => {
    const hasItems = Object.keys(selectedItems).length > 0;
    if (!hasItems) {
      alert("Debes agregar al menos un producto.");
      return;
    }

    const itemsToAdd = food_list
      .filter(f => selectedItems[f._id])
      .map(f => ({ ...f, quantity: selectedItems[f._id] }));

    const response = await axios.post(
      url + "/api/order/add-items",
      { orderId, items: itemsToAdd },
      { headers: { token } }
    );

    if (response.data.success) {
      globalThis.location.replace(response.data.session_url);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className='my-orders'>
      <h2>Mis ordenes</h2>
      <div className="container">
        {data.map((order) => {
          const { label, color } = getStatusLabel(order);
          // ✅ Ahora — permite editar si está pagado pero aún no salió a delivery
          const isPending = order.status === "Food Processing" || order.status === "Procesando";

          return (
            <div key={order._id} className="my-orders-order">
              <img src={assets.parcel_icon} alt="" />

              <p>{order.items.map((item, index) =>
                index === order.items.length - 1
                  ? item.name + " x " + item.quantity
                  : item.name + " x " + item.quantity + ", "
              )}</p>

              <p>S/. {order.amount}.00</p>
              <p>Items: {order.items.length}</p>

              {/* ✅ Badge de estado */}
              <p>
                <span style={{ color }}>&#x25cf;</span>{" "}
                <b style={{ color }}>{label}</b>
              </p>

              <div className="order-actions">
                <button onClick={fetchOrders}>Seguir orden</button>

                {/* ✅ Solo pedidos sin pagar pueden editarse */}
                {isPending && (
                  <button
                    className="btn-edit-order"
                    onClick={() => {
                      setEditingOrder(editingOrder === order._id ? null : order._id);
                      setSelectedItems({});
                    }}
                  >
                    {editingOrder === order._id ? "Cancelar" : "Agregar productos"}
                  </button>
                )}
              </div>

              {/* ✅ Panel de edición */}
              {editingOrder === order._id && (
                <div className="edit-order-panel">
                  <div className="edit-order-warning">
                    ⚠️ Solo puedes <b>agregar</b> productos. No hay devoluciones ni reducciones de pedido.
                  </div>
                  <div className="edit-order-items">
                    {food_list.filter(f => f.available).map(f => (
                      <div key={f._id} className="edit-order-item">
                        <img src={url + "/images/" + f.image} alt={f.name} />
                        <span>{f.name} — S/{f.price}</span>
                        <div className="edit-order-qty">
                          <button onClick={() => handleAddItem(f._id, -1)}>−</button>
                          <span>{selectedItems[f._id] || 0}</span>
                          <button onClick={() => handleAddItem(f._id, +1)}>+</button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <button
                    className="btn-confirm-edit"
                    onClick={() => handleSubmitEdit(order._id)}
                  >
                    Confirmar y pagar adicional
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default MyOrders;