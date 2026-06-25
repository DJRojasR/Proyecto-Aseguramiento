import { createContext, useEffect, useState, useMemo, useCallback } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const StoreContext = createContext(null);

const StoreContextProvider = ({ children }) => {

  const [cartItems, setCartItems] = useState({});
  const [token, setToken] = useState("");
  const [foodList, setFoodList] = useState([]);

  const url = "http://localhost:4000";

  // ─── Inicializa el carrito cuando carga la lista de comida ───
  useEffect(() => {
    if (foodList.length > 0 && Object.keys(cartItems).length === 0) {
      const initialCart = {};
      foodList.forEach((item) => {
        initialCart[item._id] = 0;
      });
      setCartItems(initialCart);
    }
  }, [foodList]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Cargar datos al iniciar ───
  useEffect(() => {
    async function loadData() {
      await fetchFoodList();
      const savedToken = localStorage.getItem("token");
      if (savedToken) {
        setToken(savedToken);
        await loadCartData(savedToken);
      }
    }
    loadData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Fetch lista de comida ───
  const fetchFoodList = useCallback(async () => {
    try {
      const response = await axios.get(url + "/api/food/list");
      setFoodList(response.data.data);
    } catch (error) {
      console.error("Error cargando productos:", error.message);
    }
  }, []);

  // ─── Cargar carrito desde el servidor ───
  const loadCartData = useCallback(async (tkn) => {
  try {
    const response = await axios.post(
      url + "/api/cart/get",
      {},
      { headers: { token: tkn } }
    );
    // ✅ Verifica que cartData exista antes de setearlo
    if (response.data.cartData) {
      setCartItems(response.data.cartData);
    }
  } catch (error) {
    // ✅ No rompe la app — el carrito simplemente queda vacío
    console.warn("Carrito vacío o no encontrado:", error.message);
  }
}, []);

  // ─── Agregar al carrito ───
  const addToCart = useCallback(async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: (prev[itemId] || 0) + 1 }));
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/add",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error agregando al carrito:", error.message);
      }
    }
  }, [token]);

  // ─── Remover del carrito ───
  const removeFromCart = useCallback(async (itemId) => {
    setCartItems((prev) => ({ ...prev, [itemId]: Math.max((prev[itemId] || 0) - 1, 0) }));
    if (token) {
      try {
        await axios.post(
          url + "/api/cart/remove",
          { itemId },
          { headers: { token } }
        );
      } catch (error) {
        console.error("Error removiendo del carrito:", error.message);
      }
    }
  }, [token]);

  // ─── Total del carrito ───
  const getTotalCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const itemId in cartItems) {
      if (cartItems[itemId] > 0) {
        const itemInfo = foodList.find((product) => product._id === itemId);
        if (itemInfo) {
          totalAmount += itemInfo.price * cartItems[itemId];
        }
      }
    }
    return totalAmount;
  }, [cartItems, foodList]);
  // Agregar esta función junto a las demás
  const clearCart = useCallback(async () => {
    setCartItems({});
    if (token) {
      try {
        await axios.post(url + "/api/cart/clear", {}, { headers: { token } });
      } catch (error) {
        console.error("Error al vaciar carrito:", error.message);
      }
    }
  }, [token]);

  // Agregar clearCart al contextValue
  const contextValue = useMemo(() => ({
    food_list: foodList,
    cartItems,
    setCartItems,
    addToCart,
    removeFromCart,
    getTotalCartAmount,
    url,
    token,
    setToken,
    loadCartData,
    clearCart, // ✅ nuevo
  }), [foodList, cartItems, token, addToCart, removeFromCart, getTotalCartAmount, loadCartData, clearCart]);

  return (
    <StoreContext.Provider value={contextValue}>
      {children}
    </StoreContext.Provider>
  );
};


StoreContextProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default StoreContextProvider;