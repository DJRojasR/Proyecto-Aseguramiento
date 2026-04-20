
/**
 * CONFIGURANDO EL SERVIDOR.....
 */


// Importamos Express para crear el servidor
import "dotenv/config"
import express from "express";
// Importamos CORS para permitir solicitudes desde diferentes orígenes (necesario para frontend-backend)
import cors from "cors";
import { connectDB } from "./config/db.js";
import foodRoute from "./routes/foodRoute.js";
import userRouter from "./routes/userRoute.js";
import cartRouter from "./routes/cartRoute.js";
import orderRouter from "./routes/orderRoute.js";


// Creamos una instancia de la aplicación Express
const app = express();
// Definimos el puerto en el que correrá el servidor
const port = 4000;

// Middleware para habilitar el uso de JSON en las solicitudes
app.use(express.json());
// Middleware para permitir solicitudes desde otros dominios (CORS)
app.use(cors());

//db coneccion
connectDB();

//Api endpoints
app.use("/api/food", foodRoute);
app.use("/images",express.static("uploads")) //para mostrar las imagenes en uploads
app.use("/api/user", userRouter);
app.use("/api/cart", cartRouter); // Ruta para el carrito de compras 
app.use("/api/order", orderRouter); // Ruta para las ordenes 

// Ruta principal: responde con un mensaje cuando se accede a "/"
app.get("/", (req, res) => {
  res.send("API Working"); // Responde con un mensaje simple para verificar que la API está en funcionamiento
});

// Inicia el servidor y escucha en el puerto definid
app.listen(port, () => {
  console.log(`Server Started on http://localhost:${port} `); // Mensaje en consola indicando que el servidor está en ejecución
});


//mongodb+srv://DJRojasR:<db_password>@juliafish.ufscbao.mongodb.net/
