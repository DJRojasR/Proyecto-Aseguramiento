import express from 'express';
<<<<<<< HEAD
import { addFood, listFood, listFoodAdmin, removeFood, toggleAvailability } from '../controllers/foodController.js';
=======
import { addFood, listFood, removeFood, toggleAvailability, updateFood } from '../controllers/foodController.js';
>>>>>>> e30aeb39a004256e3a623ec3d2739863f3069bf3
import multer from 'multer';

const foodRoute = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }
});

foodRoute.post('/addfood',  upload.single("image"), addFood);
foodRoute.get('/list',      listFood);
foodRoute.get('/list-admin', listFoodAdmin);
foodRoute.post('/remove',   removeFood);
foodRoute.post('/toggle',   toggleAvailability); // ✅ Nueva ruta
foodRoute.post('/update', upload.single("image"), updateFood);

export default foodRoute;