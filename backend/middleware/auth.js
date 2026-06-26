import jwt from "jsonwebtoken";
import userModel from "../models/userModels.js";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "No autorizado, inicia sesión" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // ✅ Verificar que el usuario aún existe en la base de datos
    const user = await userModel.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "Cuenta eliminada. Sesión inválida." });
    }

    req.body.userId = decoded.id;
    req.body.role   = decoded.role;
    next();
  } catch (error) {
    res.json({ success: false, message: "Token inválido" });
  }
};

export default authMiddleware;