import express from 'express';
import { addFood,listFood,removeFood } from '../controllers/foodController.js';
import multer from 'multer';

const foodRoute = express.Router();

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); //donde se guardaran los archivos
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "-" + file.originalname);
; //nombre del archivo
    }
});

const upload = multer({ storage: storage });


// creamos un objeto de almacenamiento con multer
foodRoute.post('/addfood', upload.single("image"),addFood);
foodRoute.get("/list",listFood)
foodRoute.post("/remove",removeFood);





export default foodRoute;