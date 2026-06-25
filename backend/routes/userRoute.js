import express from 'express';
import { loginUser, registerUser, removeuser, userlist, updateRole } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post('/register', registerUser);
userRouter.post('/login', loginUser);
userRouter.get('/list', userlist);
userRouter.post('/remove', removeuser);
userRouter.post('/update-role', updateRole); // ✅ Nueva ruta

export default userRouter;