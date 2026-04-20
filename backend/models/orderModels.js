import mongoose from "mongoose"
//Creamos el esquema de la orden con mongoose para poder guardarla en la base de datos
const orderSchema = mongoose.Schema({
    userId:{type:String, required:true},
    items:{type:Array, required:true},
    amount:{type:Number, required:true},
    address:{type:Object, required:true},
    status:{type:String, default:"Food Processing"},
    date:{type:Date, default:Date.now()},
    payment:{type:Boolean, default:false}
})

const orderModel = mongoose.models.order || mongoose.model("order", orderSchema)
export default orderModel;