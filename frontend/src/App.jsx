import React, { useState } from "react";
import Navbar from './components/Navbar/Navbar'
import {Route, Routes} from 'react-router-dom'
import Home from './pages/Home/Home'
import Cart from './pages/Cart/Cart'
import PlaceOrder from './pages/PlaceOrder/PlaceOrder'
import Footer from './components/Footer/Footer'
import LoginPopup from './components/LoginPopup/LoginPopup';
import Verify from "./pages/Verify/Verify";
import MyOrders from "./pages/MyOrders/MyOrders";
import ScrollToTopButton from './components/ScrollToTopButton/ScrollToTopButton';


const App = () => {
  const[showLogin,setShowLogin] = useState(false)


  return (
    <>
    {showLogin?<LoginPopup setShowLogin={setShowLogin}/>:<></>}
    
    <div>
      <div className='app'>
        <Navbar setShowLogin={setShowLogin}/>
        <Routes>
            {/* Creamos una ruta con el path / y el componente Home */}
            <Route path="/" element={<Home />} />
            {/* Creamos una ruta con el path /cart y el componente Cart */}
            <Route path="/cart" element={<Cart/>} />
            {/* Creamos una ruta con el path /order y el componente PlaceOrder */}
            <Route path='/order' element={<PlaceOrder/>} />
            <Route path='/verify' element={<Verify/>} />
            <Route path='/myorders' element={<MyOrders/>} />
          </Routes>
      </div>
      <Footer/>
      <ScrollToTopButton />
    </div>
    </>
  )
}

export default App
