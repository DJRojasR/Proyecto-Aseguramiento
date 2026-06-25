import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";


// Cambia createToken para incluir el rol
const createToken = (id, role) => {
  return jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

// En loginUser — devuelve también el rol
const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await userModel.findOne({ email });
    if (!user) {
      return res.json({ success: false, message: "Credenciales inválidas" });
    }
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.json({ success: false, message: "Credenciales inválidas" });
    }
    // ✅ Token incluye el rol
    const token = createToken(user._id, user.role);
    // ✅ Devuelve el rol al frontend
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// En registerUser — los usuarios nuevos siempre son 'customer'
const registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await userModel.findOne({ email });
    if (exists) {
      return res.json({ success: false, message: "Usuario ya existe" });
    }
    if (!validator.isEmail(email)) {
      return res.json({ success: false, message: "Por favor ingresar un email válido" });
    }
    if (password.length < 8) {
      return res.json({ success: false, message: "La contraseña debe tener al menos 8 caracteres" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
      role: 'customer' // ✅ Siempre customer al registrarse
    });

    const user = await newUser.save();
    const token = createToken(user._id, user.role);
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};


const userlist = async (req, res)=>{
	try{
		const users = await userModel.find({});
		res.json({success: true, data:users });
	}catch(error){
		console.log(error);
		res.json({ success: false, message: "error" });
	}
}

const removeuser = async(req, res)=>{
	try{
		const user = await userModel.findById(req.body.id);
		if (!user) {
			return res.json({ success: false, message: "user not found" });
		}
		await userModel.findByIdAndDelete(req.body.id);
		res.json({ success: true, message: "user remove" });
	}catch(error){
		 console.log(error);
    	 res.json({success:false,message:"error"})
	}

};

export { loginUser, registerUser,userlist, removeuser };
