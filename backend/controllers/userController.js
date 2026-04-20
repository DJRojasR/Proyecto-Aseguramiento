import userModel from "../models/userModels.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";

// login user
const loginUser = async (req, res) => {
	const { email, password } = req.body;
	try {
		// revisando si el usuario ya existe
		const user = await userModel.findOne({ email });
		//si no existe el usuario
		if (!user) {
			return res.json({ success: false, message: "Credenciales inválidas" });
		}
		// comparando contraseñas
		const match = await bcrypt.compare(password, user.password);
		//si no coinciden las contraseñas
		if (!match) {
			return res.json({ success: false, message: "Credenciales inválidas" });
		}
		//creamos el token
		const token = createToken(user._id);
		res.json({ success: true, token });
	} catch (error) {
		console.log("Error en loginUser:", error); // 👀 Ver error detallado
		res.json({ success: false, message: error.message }); // 👀 Enviar error real
	}
};

const createToken = (id) => {
    console.log("JWT_SECRET:", process.env.JWT_SECRET); // 👀 Ver si tiene valor
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};



// Registrar usuarios
const registerUser = async (req, res) => {
	const { name, email, password } = req.body;
	try {
		//revisando si el usuario ya existe
		const exists=await userModel.findOne({email});
		if(exists){
			return res.json({success:false,message:"Usuario ya existe"});
		}
		
		// validando email y contraseña fuerte
		if(!validator.isEmail(email)){
			return res.json({success:false,message:"Por favor ingresar un email válido"});
		}
		if(password.length<8){
			return res.json({success:false,message:"La contraseña debe tener al menos 8 caracteres"});
		}
		// encriptando la contraseña hacemos useo de exceptiones para manejar errores
		
			const salt = await bcrypt.genSalt(10);
			const hashedPassword = await bcrypt.hash(password, salt);
		
		

		const newUser = new userModel({
			
			name: name,
			email: email,
			password: hashedPassword, 
		
		});

		const user=await newUser.save();
		const token=createToken(user._id)
		res.json({success:true,token});

	} catch (error) {
		console.log("Error en registerUser:", error); // 👀 Ver error detallado
		res.json({ success: false, message: error.message }); // 👀 Enviar error real
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
