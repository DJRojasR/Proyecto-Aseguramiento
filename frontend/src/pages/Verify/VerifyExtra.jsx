import React, { useContext, useEffect } from 'react';
import "./Verify.css"; // reusar el mismo spinner
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StoreContext } from '../../context/StoreContext';
import axios from 'axios';

const VerifyExtra = () => {
  const [searchParams] = useSearchParams();
  const success = searchParams.get("success");
  const orderId = searchParams.get("orderId");
  const { url, token } = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    const verify = async () => {
      if (success === "true") {
        // Los items ya fueron guardados antes de redirigir a Stripe
        // Solo notificamos éxito y redirigimos
        alert("✅ Productos adicionales agregados correctamente. ¡Sin devoluciones!");
        navigate("/myorders");
      } else {
        // Pago cancelado — revertir los items agregados
        try {
          await axios.post(url + "/api/order/revert-extra", { orderId }, { headers: { token } });
        } catch (e) {
          console.error("Error al revertir:", e.message);
        }
        alert("Pago cancelado. Los productos adicionales no fueron agregados.");
        navigate("/myorders");
      }
    };
    verify();
  }, []);

  return (
    <div className='verify'>
      <div className='spinner'></div>
    </div>
  );
};

export default VerifyExtra;