
import userModel from "../models/userModels.js";
//Agrega items al carrito
const addToCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = await userData.cartData;
    if (!cartData[req.body.itemId]) {
      cartData[req.body.itemId] = 1;
    } else {
      cartData[req.body.itemId] += 1;
    }
    await userModel.findByIdAndUpdate(req.body.userId, { cartData });
    res.json({ success: true, message: "Item Added to Cart" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "Error" });
  }
};

//Quita items del carrito
const removeFromCart = async (req, res) => {
 try {
   let userData = await userModel.findById(req.body.userId);
   if (!userData) {
     return res.json({ success: false, message: "Usuario no encontrado" });
   }

   let cartData = userData.cartData || {}; // Asegurar que es un objeto
   if (!cartData[req.body.itemId] || cartData[req.body.itemId] <= 0) {
     return res.json({ success: false, message: "Item no está en el carrito" });
   }

   // Reducir cantidad del item
   cartData[req.body.itemId] -= 1;
   if (cartData[req.body.itemId] === 0) {
     delete cartData[req.body.itemId]; // Si llega a 0, eliminar del carrito
   }

   await userModel.findByIdAndUpdate(req.body.userId, { cartData });

   res.json({ success: true, message: "Item eliminado del carrito" });
 } catch (error) {
   console.error("Error en removeFromCart:", error);
   res
     .status(500)
     .json({ success: false, message: "Error interno del servidor" });
 }
};

//fetch user cart data
const getCart = async (req, res) => {
  try {
    let userData = await userModel.findById(req.body.userId);
    let cartData = userData.cartData || {}; // por si cartData es undefined
    res.json({ success: true, cartData });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Error interno del servidor" });
  }
};


export { addToCart, removeFromCart, getCart };
