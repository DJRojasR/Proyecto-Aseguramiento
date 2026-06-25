import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
  const { token } = req.headers;
  if (!token) {
    return res.json({ success: false, message: "No autorizado, inicia sesión" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.body.userId = decoded.id;
    req.body.role   = decoded.role; // ✅ Disponible en los controladores
    next();
  } catch (error) {
    res.json({ success: false, message: "Token inválido" });
  }
};

export default authMiddleware;