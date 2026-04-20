import express from 'express'; //exprees es un framework de nodejs
import authMiddleware from '../middleware/auth.js'; //importamos el middleware de autenticacion
import { placeOrder, userOrders, verifyOrder,listOrders,updateStatus } from '../controllers/orderController.js';

const orderRouter = express.Router(); //creamos un router con express
orderRouter.post('/place', authMiddleware, placeOrder); //creamos una ruta post para crear una orden
orderRouter.post("/verify",verifyOrder); //creamos una ruta posterior para verificar la orden
orderRouter.post("/userorders",authMiddleware,userOrders)
orderRouter.get('/list', listOrders); //creamos una ruta get para listar las ordenes
orderRouter.post("/status", updateStatus); //creamos una ruta post para actualizar el estado de la orden

export default orderRouter; //exportamos el router
