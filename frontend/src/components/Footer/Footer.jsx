import React from 'react'
import './Footer.css'
import { assets } from "../../assets/assets";
const Footer = () => {
  return (
    <div className='footer' id='footer'>
        <div className="footer-content">
            <div className='footer-content-left'>
                <img src={assets.juliaFishLogo2} alt="" />
                <p>JuliaFish es una restaurante donde puedes disfrutar de los mejores platillos de mariscos, con un ambiente agradable y un excelente servicio.</p>
                <div className="footer-social-icons">
                    <img src={assets.facebook_icon} alt="" />
                    <img src={assets.linkedin_icon} alt="" />
                    <img src={assets.twitter_icon} alt="" />
                </div>
            </div>
            <div className='footer-content-right'>
                <h2>Restaurante</h2>
                <ul>
                    <li>Inicio</li>
                    <li>Sobre nosotros</li>
                    <li>Envíos</li>
                    <li>Política de privacidad</li>
                </ul>
            </div>
            <div className='footer-content-center'>
                <h2>Contáctanos</h2>
                <ul>
                    <li>+51 98574865</li>
                    <li>juliafish@gmail.com</li>
                </ul>
            </div>
        </div>
        <hr />
        <div className='footer-copyright'>
            <p>&copy; 2021 JuliaFish. Todos los derechos reservados.</p>
        </div>
    </div>
  )
}

export default Footer