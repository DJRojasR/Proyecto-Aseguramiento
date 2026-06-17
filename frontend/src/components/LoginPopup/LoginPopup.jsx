import React, { useContext, useState } from "react";
import PropTypes from "prop-types";
import "./LoginPopup.css";
import { assets } from "../../assets/assets";
import { StoreContext } from "../../context/StoreContext";
import axios from "axios";

const LoginPopup = ({ setShowLogin }) => {

  const { url, setToken, loadCartData } = useContext(StoreContext);
  const [currState, setCurrState] = useState("Login");
  const [data, setData] = useState({ name: "", email: "", password: "" });

  const onChangeHandler = (event) => {
    const name = event.target.name;
    const value = event.target.value;
    setData(data => ({ ...data, [name]: value }));
  };

  const onLogin = async (event) => {
    event.preventDefault();
    let newUrl = url;
    if (currState === "Login") {
      newUrl += "/api/user/login";
    } else {
      newUrl += "/api/user/register";
    }
    const response = await axios.post(newUrl, data);
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      await loadCartData(response.data.token);
      setShowLogin(false);
    } else {
      alert(response.data.message);
    }
  };

  return (
    <div className='login-popup'>
      <form onSubmit={onLogin} className="login-popup-container">
        <div className="login-popup-title">
          <h2>{currState}</h2>

          {/* ✅ button en lugar de img con onClick */}
          <button
            type="button"
            onClick={() => setShowLogin(false)}
            onKeyDown={(e) => e.key === 'Enter' && setShowLogin(false)}
            className="login-close-btn"
            aria-label="Cerrar"
          >
            <img src={assets.cross_icon} alt="Cerrar" />
          </button>
        </div>

        <div className="login-popup-inputs">
          {currState !== "Login" && (
            <input name='name' onChange={onChangeHandler} value={data.name} type="text" placeholder='Nombre' required />
          )}
          <input name='email' onChange={onChangeHandler} value={data.email} type="email" placeholder='email' required />
          <input name='password' onChange={onChangeHandler} value={data.password} type="password" placeholder='contraseña' required />
        </div>

        <button type='submit'>
          {currState === "Sign Up" ? "Create account" : "Login"}
        </button>

        <div className="login-popup-condition">
          <input type="checkbox" required />
          <p>Acepto Terminos y Condiciones</p>
        </div>

        {/* ✅ button en lugar de span con onClick */}
        {currState === "Login"
          ? <p>Crear Cuenta nueva?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => setCurrState("Sign Up")}
                onKeyDown={(e) => e.key === 'Enter' && setCurrState("Sign Up")}
              >
                Click aqui
              </button>
            </p>
          : <p>Ya tienes cuenta?{" "}
              <button
                type="button"
                className="link-btn"
                onClick={() => setCurrState("Login")}
                onKeyDown={(e) => e.key === 'Enter' && setCurrState("Login")}
              >
                Login aqui
              </button>
            </p>
        }
      </form>
    </div>
  );
};

LoginPopup.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
};

export default LoginPopup;