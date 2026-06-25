import foodModel from "../models/foodModels.js";
import fs from "node:fs";

const addFood = async (req, res) => {
  let image_filename = `${req.file.filename}`;
  const food = new foodModel({
    name:        req.body.name,
    description: req.body.description,
    price:       req.body.price,
    image:       image_filename,
    category:    req.body.category,
    available:   true // ✅ Siempre disponible al crear
  });
  try {
    await food.save();
    res.json({ success: true, message: "Food item added successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

const listFood = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

const removeFood = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Producto no encontrado" });
    }
    fs.unlink(`uploads/${food.image}`, () => {});
    await foodModel.findByIdAndDelete(req.body.id);
    res.json({ success: true, message: "food removed" });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

// ✅ Nuevo: activa o desactiva disponibilidad
const toggleAvailability = async (req, res) => {
  try {
    const food = await foodModel.findById(req.body.id);
    if (!food) {
      return res.json({ success: false, message: "Producto no encontrado" });
    }
    await foodModel.findByIdAndUpdate(req.body.id, { available: !food.available });
    res.json({
      success: true,
      message: `Producto ${!food.available ? "habilitado" : "deshabilitado"}`,
      available: !food.available
    });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: "error" });
  }
};

export { addFood, listFood, removeFood, toggleAvailability };