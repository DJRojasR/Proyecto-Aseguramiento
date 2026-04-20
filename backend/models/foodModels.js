import mongoose from "mongoose";
// creamos un esquema para la comida
const foodSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
});

// creamos un modelo de comida o se exporta si ya existe
const foodModels = mongoose.models.food || mongoose.model("Food", foodSchema);
export default foodModels;