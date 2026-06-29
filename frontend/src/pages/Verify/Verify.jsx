import React, { useContext, useEffect } from 'react'
import "./Verify.css"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios'

const Verify = () => {

  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        const response = await axios.post(url + "/api/order/verify", { success, orderId });
        if (response.data.success) {
          navigate("/myorders");
        } else {
          console.error("Verify falló:", response.data.message);
          alert("El pago no pudo ser completado. Puedes revisarlo o reintentarlo en tus órdenes.");
          navigate("/myorders");
        }
      } catch (error) {
        console.error("Error en verifyPayment:", error.message);
        navigate("/");
      }
    };

    verifyPayment(); // ✅ definida y llamada dentro del mismo useEffect
  }, []);

  return (
    <div className='verify'>
      <div className='spinner'></div>
    </div>
  )
}

export default Verify