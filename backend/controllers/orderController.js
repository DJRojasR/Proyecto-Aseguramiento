import orderModel from "../models/orderModels.js";
import userModel from "../models/userModels.js";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//creamos la orden con los datos del usuario
const placeOrder = async (req, res) => {

    const frontendUrl = "http://localhost:5174"; //URL del frontend
    try {
       const newOrder = new orderModel({
           userId: req.body.userId,
           items: req.body.items,
           amount: req.body.amount,
           address: req.body.address,
       })
       
       // console.log(newOrder);
       await newOrder.save(); {/*guardamos la orden en la base de datos*/}
       const orders = await orderModel.find({});
       console.log("Órdenes después de insertar:", orders);
       await userModel.findByIdAndUpdate(req.body.userId, {cartData:{}});{/*borramos los items del carrito del usuario*/}
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
         {/*creamos la sesion de pago con stripe
         y le pasamos los items de la orden*/}
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
    const {orderId,success}=req.body;
    try{
            if(success=="true"){
                await orderModel.findByIdAndUpdate(orderId, {payment:true});
                res.json({success:true, message:"Paid"})


            }
            else{
                await orderModel.findByIdAndDelete(orderId);
                res.json({success:false, message:"Not paid"});

            }
    }catch(error){
        console.log(error);
        res.json({success:false, message:"Error al verificar la orden"})

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




export {placeOrder,verifyOrder,userOrders,listOrders, updateStatus}; 