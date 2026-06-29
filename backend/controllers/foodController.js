import foodModel from "../models/foodModels.js";
import fs from "node:fs";

const addFood = async (req, res) => {
  // ✅ Validaciones del lado del servidor
  const name = req.body.name?.trim();
  const description = req.body.description?.trim();
  const price = Number(req.body.price);
  const category = req.body.category?.trim();

  if (!name || name.length < 2 || name.length > 60) {
    return res.json({ success: false, message: "Nombre inválido (2-60 caracteres)" });
  }
  if (!description || description.length < 10 || description.length > 300) {
    return res.json({ success: false, message: "Descripción inválida (10-300 caracteres)" });
  }
  if (!price || price <= 0 || price > 999 || !Number.isFinite(price)) {
    return res.json({ success: false, message: "Precio inválido (1-999)" });
  }
  if (!req.file) {
    return res.json({ success: false, message: "Imagen requerida" });
  }

  const food = new foodModel({
    name,
    description,
    price,
    image: req.file.filename,
    category,
    available: true
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
    const foods = await foodModel.find({available: true });
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

// Nuevo: activa o desactiva disponibilidad
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

<<<<<<< HEAD
// Solo para el admin — sin filtro
const listFoodAdmin = async (req, res) => {
  try {
    const foods = await foodModel.find({});
    res.json({ success: true, data: foods });
  } catch (error) {
    res.json({ success: false, message: "error" });
  }
};

export { addFood, listFood, listFoodAdmin, removeFood, toggleAvailability };
=======
const updateFood = async (req, res) => {
  try {
    const { id, name, description, price, category } = req.body;

    // Validaciones
    if (name && (name.trim().length < 2 || name.trim().length > 60)) {
      return res.json({ success: false, message: "Nombre inválido (2-60 caracteres)" });
    }
    if (price && (Number(price) <= 0 || Number(price) > 9999)) {
      return res.json({ success: false, message: "Precio inválido (1-9999)" });
    }

    const food = await foodModel.findById(id);
    if (!food) {
      return res.json({ success: false, message: "Producto no encontrado" });
    }

    const updatedFields = {
      name:        name?.trim()        || food.name,
      description: description?.trim() || food.description,
      price:       price               ? Number(price) : food.price,
      category:    category            || food.category,
    };

    // Si se subió nueva imagen
    if (req.file) {
      fs.unlink(`uploads/${food.image}`, () => {});
      updatedFields.image = req.file.filename;
    }

    await foodModel.findByIdAndUpdate(id, updatedFields);
    res.json({ success: true, message: "Producto actualizado correctamente" });
  } catch (error) {
    console.error("Error en updateFood:", error);
    res.json({ success: false, message: error.message });
  }
};

export { addFood, listFood, removeFood, toggleAvailability, updateFood };
>>>>>>> e30aeb39a004256e3a623ec3d2739863f3069bf3
