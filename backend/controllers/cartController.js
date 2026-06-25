import userModel from "../models/userModels.js";

// Agrega items al carrito
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }

    // ✅ Sin el "await" innecesario — cartData no es una Promise
    let cartData = userData.cartData || {};

    if (cartData[req.body.itemId]) {
      cartData[req.body.itemId] += 1;
    } else {
      cartData[req.body.itemId] = 1;
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Item Added to Cart" });
  } catch (error) {
    console.error("Error en addToCart:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// Quita items del carrito
const removeFromCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }

    let cartData = userData.cartData || {};

    if (!cartData[req.body.itemId] || cartData[req.body.itemId] <= 0) {
      return res.json({ success: false, message: "Item no está en el carrito" });
    }

    cartData[req.body.itemId] -= 1;
    if (cartData[req.body.itemId] === 0) {
      delete cartData[req.body.itemId];
    }

    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Item eliminado del carrito" });
  } catch (error) {
    console.error("Error en removeFromCart:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};

// Obtiene el carrito del usuario
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    if (!userData) {
      return res.json({ success: false, message: "Usuario no encontrado" });
    }

    let cartData = userData.cartData || {};
    res.json({ success: true, cartData });
  } catch (error) {
    console.error("Error en getCart:", error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};
const clearCart = async (req, res) => {
  try {
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });
    res.json({ success: true, message: "Carrito vaciado" });
  } catch (error) {
    console.error("Error en clearCart:", error);
    res.status(500).json({ success: false, message: "Error interno" });
  }
};

export { addToCart, removeFromCart, getCart, clearCart };