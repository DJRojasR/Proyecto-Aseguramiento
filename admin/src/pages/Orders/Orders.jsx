import React, { useEffect, useState } from 'react'
import "./Orders.css"
import axios from 'axios';
import { toast } from 'react-toastify';
import {assets} from '../../assets/assets';
const Orders = ({url}) => {

  const[orders, setOrders] = useState([]);

  const fetchOrders = async () => {
    const response = await axios.get(url+"/api/order/list");
    if(response.data.success){
      setOrders(response.data.data);
      console.log(response.data.data);
    }
    else{
      alert("Error al cargar las ordenes");
      toast.error("Error al cargar las ordenes");
    }
  }

  const statusHandler = async (event, orderId) => {
   const response = await axios.post(url+"/api/order/status", {
    orderId,
    status: event.target.value
   });
    if(response.data.success){
        await fetchOrders();
    }else{
      toast.error("Error al actualizar el estado de la orden");
    }
  }

  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <div className="order add ">
      <h3>Lista de Ordenes</h3>
      <div className="order-list">
        {orders.map((order, index) => ( 
        <div key={index} className="order-item">{/* traemos las ordenes de la base de datos  y  en el div agregamos una key para que no de error */}
        <img src={assets.parcel_icon} alt=''/> {/* traemos las imagenes de la carpeta assets */}
              <div>
                    <p className="order-item-food">
                      {/* traemos los items de la orden y los mostramos en pantalla */}
                      {order.items.map((item, index) => {
                        if(index === order.items.length - 1){
                          return item.name + " x" + item.quantity;
                        }else{
                          return item.name + " x" + item.quantity + ", ";
                        }
                      })}
                    </p>
                   
                    <p className='order-item-name'>
                      {order.address.nombre+" "+ order.address.apellido} {/* traemos el nombre del usuario */}  
                    </p>
                    <div className='order-item-address'>
                      <p>{order.address.direccion +","}</p>
                      <p>{order.address.ciudad+", "+ order.address.distrito+ ", "+ order.address.pais+", "+order.address.codigopostal}</p>
                    </div>
                    <p className='order-item-phone'>
                        {order.address.phone} {/* traemos el telefono del usuario */}
                        </p>
            </div>
          <p>Items: {order.items.length}</p>
          <p>Precio Total: {order.amount} PEN</p>
          <select onChange={(e) => statusHandler(e, order._id)} value={order.status} className="order-item-status"> {/* traemos el estado de la orden y creamos un evento que se ejecute al cambiar el estado */}
                      <option value="Procesando">En proceso</option>
                      <option value="Pendiente">Pendiente</option>
                      <option value="Entregado">Entregado</option>
          </select>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Orders