import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cartData: { type: Object, default: {} },
  // ✅ Nuevo campo
  role:     { type: String, enum: ['customer', 'admin'], default: 'customer' }
}, { minimize: false });

const userModel = mongoose.models.User || mongoose.model('User', userSchema);
export default userModel;