import { useState, useContext } from 'react'
import PropTypes from 'prop-types'
import { Link, useNavigate } from 'react-router-dom'
import { RiMenu3Line, RiCloseLine } from 'react-icons/ri'
import { motion, AnimatePresence } from 'framer-motion'
import { StoreContext } from '../../context/StoreContext'
import { assets } from '../../assets/assets'
import './Navbar.css'

// Efecto "caída desde arriba" con delay escalonado
const SlideDown = (delay = 0) => ({
  initial:  { y: -40, opacity: 0 },
  animate:  { y: 0,   opacity: 1, transition: { delay, duration: 0.5, ease: 'easeOut' } },
  exit:     { y: -40, opacity: 0, transition: {        duration: 0.4, ease: 'easeIn'  } },
})

// Animación del menú móvil desplegable
const mobileMenuVariants = {
  hidden:  { opacity: 0, height: 0,      transition: { duration: 0.3, ease: 'easeIn'  } },
  visible: { opacity: 1, height: 'auto', transition: { duration: 0.4, ease: 'easeOut' } },
}

const Navbar = ({ setShowLogin }) => {

  const [menu, setMenu]         = useState('home')
  const [menuOpen, setMenuOpen] = useState(false)

  const { getTotalCartAmount, token, setToken } = useContext(StoreContext)
  const navigate = useNavigate()

  const logout = () => {
    localStorage.removeItem('token')
    setToken('')
    navigate('/')
  }

  const handleMenuClick = (section) => {
    setMenu(section)
    setMenuOpen(false)
  }

  const cartCount = getTotalCartAmount()

  // Navega a la página principal y luego hace scroll al anchor indicado.
  // Necesario porque href="#id" solo funciona si ya estás en "/".
  // Si ya estamos en "/", scrollea directo; si no, navega primero y
  // espera un tick para que el DOM esté listo antes de scrollear.
  const navigateToSection = (sectionId, menuKey) => {
    handleMenuClick(menuKey)
    if (globalThis.location.pathname === '/') {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
    } else {
      navigate('/')
      // setTimeout da tiempo a React Router para renderizar la nueva ruta
      setTimeout(() => {
        document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
  }

  return (
    <nav>
      <div className="navbar">

        {/* ── LOGO ── */}
        <Link to="/">
          <motion.img
            src={assets.logo_juliaFish}
            alt="JuliaFish logo"
            className="logo"
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            whileHover={{ scale: 1.05, opacity: 0.9 }}
          />
        </Link>

        {/* ── MENÚ DESKTOP ── */}
        <ul className="navbar-menu">
          <motion.li variants={SlideDown(0.15)} initial="initial" animate="animate" exit="exit">
            <Link to="/" className={menu === 'home' ? 'active' : ''} onClick={() => handleMenuClick('home')}>
              Inicio
            </Link>
          </motion.li>
          <motion.li variants={SlideDown(0.25)} initial="initial" animate="animate" exit="exit">
            {/* Botón en vez de <a href> para poder navegar a "/" primero si hace falta */}
            <button className={`nav-anchor ${menu === 'menu' ? 'active' : ''}`} onClick={() => navigateToSection('explore-menu', 'menu')}>
              Menú
            </button>
          </motion.li>
          <motion.li variants={SlideDown(0.35)} initial="initial" animate="animate" exit="exit">
            <button className={`nav-anchor ${menu === 'contact-us' ? 'active' : ''}`} onClick={() => navigateToSection('footer', 'contact-us')}>
              Contáctanos
            </button>
          </motion.li>
          <motion.li variants={SlideDown(0.45)} initial="initial" animate="animate" exit="exit">
            <Link to="/Cart" className={`pedido-link ${menu === 'cart' ? 'active' : ''}`} onClick={() => handleMenuClick('cart')}>
              Tu Pedido
              {cartCount > 0 && <span className="pedido-badge">{cartCount}</span>}
            </Link>
          </motion.li>
        </ul>

        {/* ── MENÚ MÓVIL DESPLEGABLE ──
            Incluye todos los links + "Iniciar sesión" o perfil al final
            En móvil NO hay nada en navbar-right*/}
        <AnimatePresence>
          {menuOpen && (
            <motion.ul
              className="navbar-menu-mobile"
              variants={mobileMenuVariants}
              initial="hidden"
              animate="visible"
              exit="hidden"
            >
              <li>
                <Link to="/" className={menu === 'home' ? 'active' : ''} onClick={() => handleMenuClick('home')}>
                  Inicio
                </Link>
              </li>
              <li>
                <button className={`nav-anchor ${menu === 'menu' ? 'active' : ''}`} onClick={() => navigateToSection('explore-menu', 'menu')}>
                  Menú
                </button>
              </li>
              <li>
                <button className={`nav-anchor ${menu === 'contact-us' ? 'active' : ''}`} onClick={() => navigateToSection('footer', 'contact-us')}>
                  Contáctanos
                </button>
              </li>
              <li>
                <Link to="/Cart" className={`pedido-link-mobile ${menu === 'cart' ? 'active' : ''}`} onClick={() => handleMenuClick('cart')}>
                  Tu Pedido {cartCount > 0 && <span className="pedido-badge">{cartCount}</span>}
                </Link>
              </li>

              {/* Con sesión → opciones de perfil dentro del menú; sin sesión → "Iniciar sesión" */}
              {token ? (
                <>
                  <li>
                    <button onClick={() => { navigate('/myorders'); setMenuOpen(false) }}>
                      Mis pedidos
                    </button>
                  </li>
                  <li>
                    <button onClick={logout}>
                      Cerrar sesión
                    </button>
                  </li>
                </>
              ) : (
                <li>
                  <button
                    className="mobile-login-btn"
                    onClick={() => { setShowLogin(true); setMenuOpen(false) }}
                  >
                    Iniciar sesión
                  </button>
                </li>
              )}
            </motion.ul>
          )}
        </AnimatePresence>

        {/* ── LADO DERECHO ──
            Desktop: botón de sesión / perfil
            Móvil  : oculto completamente (CSS: display none)
            Solo se muestra la hamburguesa en pantallas pequeñas */}
        <div className="navbar-right">

          {/* Hamburguesa — visible solo en móvil (CSS) */}
          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {menuOpen ? <RiCloseLine size={26} /> : <RiMenu3Line size={26} />}
          </button>

          {/* Botón / perfil — visible solo en desktop (CSS) */}
          <motion.div
            className="navbar-auth"
            variants={SlideDown(0.5)}
            initial="initial"
            animate="animate"
          >
            {token ? (
              <div className="navbar-profile">
                <img src={assets.profile_icon} alt="Perfil" />
                <ul className="nav-profile-dropdown">
                  <motion.li whileHover={{ x: 4 }} onClick={() => navigate('/myorders')}>
                    <img src={assets.bag_icon} alt="" />
                    <p>Mis pedidos</p>
                  </motion.li>
                  <hr />
                  <motion.li whileHover={{ x: 4 }} onClick={logout}>
                    <img src={assets.logout_icon} alt="" />
                    <p>Cerrar sesión</p>
                  </motion.li>
                </ul>
              </div>
            ) : (
              <motion.button
                onClick={() => setShowLogin(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                Iniciar sesión
              </motion.button>
            )}
          </motion.div>

        </div>
      </div>
    </nav>
  )
}

Navbar.propTypes = {
  setShowLogin: PropTypes.func.isRequired,
}

export default Navbar