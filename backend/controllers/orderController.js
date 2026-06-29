import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//creamos la orden con los datos del usuario
const placeOrder = async (req, res) => {

    const frontendUrl = "http://localhost:5173"; //URL del frontend
    try {
       const newOrder = new orderModel({
           userId: req.body.userId,
           items: req.body.items,
           amount: req.body.amount,
           address: req.body.address,
       })
       
       await newOrder.save();
       const orders = await orderModel.find({});
       console.log("Órdenes después de insertar:", orders);
       await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});
       const line_items = req.body.items.map((item)=>({
              price_data:{
                //Moneda en la que se va a pagar
                currency: "pen", 
                product_data:{
                     name: item.name,
                },
                unit_amount: item.price * 100,
              },
              quantity: item.quantity
         }))

         line_items.push({
             price_data:{
                 currency: "pen",
                 product_data:{
                     name: "Delivery Charges",
                 },
                 unit_amount: 2*100,
             },
             quantity: 1,
         })
         const session = await stripe.checkout.sessions.create({
            line_items:line_items,
            mode:'payment',
            success_url: `${frontendUrl}/verify?success=true&orderId=${newOrder._id}`,
            cancel_url: `${frontendUrl}/verify?success=false&orderId=${newOrder._id}`
         })

         res.json({success:true, session_url: session.url})

    } catch (error) {
        console.log("Error al crear la orden: ", error);
        res.json({success:false, message: "Error al crear la orden"})
    }
}
const verifyOrder = async (req, res) => {
    const { orderId, success } = req.body;
    try {
        if (success === "true") {
            // Pago exitoso: Confirmamos el pago y asignamos el estado inicial de preparación
            await orderModel.findByIdAndUpdate(orderId, { payment: true, status: "Food Processing" });
            res.json({ success: true, message: "Paid" });
        } 
        else {
            // SOLUCIÓN AL SQA: Cambiamos findByIdAndDelete por un borrado lógico (actualización de estado)
            await orderModel.findByIdAndUpdate(orderId, { status: "Pago Fallido" });
            res.json({ success: false, message: "Not paid" });
        }
    } catch (error) {
        console.log(error);
        res.json({ success: false, message: "Error al verificar la orden" });
    }
}

//Lista de ordenes del usuario
const listOrders= async (req,res)=>{
    try {
        const orders = await orderModel.find({});//buscamos las ordenes en la base de datos y poblamos el campo userId con el nombre y el email del usuario*/}
        res.json({success:true, data:orders});  
    } catch (error) {
        console.log(error);
        res.json({success:false, message:"Error al listar las ordenes"})
    }
}
//estado de orden
const updateStatus = async(req,res)=>{
    try{
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status}); //actualizamos el estado de la orden
        res.json({success:true, message:"Estado de la orden actualizado"})
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error al actualizar el estado de la orden"})
    }
}

// Desde el frontend user orders

const userOrders= async (req,res)=>{
    try{
        const orders= await orderModel.find({userId:req.body.userId});
        res.json({success:true, data:orders});

    }catch(error){
        console.log(error);
        res.json({success:false,message:"Error"})
    }


};


const addItemsToOrder = async (req, res) => {
  try {
    const order = await orderModel.findById(req.body.orderId);
    if (!order) {
      return res.json({ success: false, message: "Orden no encontrada" });
    }
    if (order.userId !== req.body.userId) {
      return res.json({ success: false, message: "No autorizado" });
    }
    // ✅ Solo bloquear si ya fue entregado o en camino
    if (order.status === "Out for Delivery" || order.status === "Delivered") {
      return res.json({ success: false, message: "No se puede modificar un pedido que ya salió a entrega." });
    }

    const existingItems = order.items;
    const newItems = req.body.items;

    // Combinar items — solo agregar, nunca reducir
    newItems.forEach(newItem => {
      const existing = existingItems.find(i => String(i._id) === String(newItem._id));
      if (existing) {
        existing.quantity += newItem.quantity;
      } else {
        existingItems.push(newItem);
      }
    });

    const newAmount = existingItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    ) + 2;

    // Calcular solo el monto adicional para cobrar en Stripe
    const additionalAmount = newItems.reduce(
      (sum, item) => sum + item.price * item.quantity, 0
    );

    const frontendUrl = "http://localhost:5173";

    const line_items = newItems.map(item => ({
      price_data: {
        currency: "pen",
        product_data: { name: item.name + " (adicional)" },
        unit_amount: item.price * 100,
      },
      quantity: item.quantity
    }));

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: 'payment',
      success_url: `${frontendUrl}/verify-extra?success=true&orderId=${order._id}`,
      cancel_url:  `${frontendUrl}/myorders`
    });

    // Guardar items y monto actualizados antes de redirigir a Stripe
    await orderModel.findByIdAndUpdate(order._id, {
      items: existingItems,
      amount: newAmount
    });

    res.json({ success: true, session_url: session.url });

  } catch (error) {
    console.error("Error en addItemsToOrder:", error);
    res.json({ success: false, message: "Error al modificar la orden" });
  }
};

const revertExtra = async (req, res) => {
  try {
    // En un sistema real guardarías un snapshot antes del cambio
    // Para pruebas solo notificamos
    res.json({ success: true, message: "Revertido" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export { placeOrder, verifyOrder, userOrders, listOrders, updateStatus, addItemsToOrder, revertExtra };