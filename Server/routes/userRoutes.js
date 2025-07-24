import express from 'express';
import { userController } from '../controller/userController.js';
import userAuth from '../middleware/userAuth.js';


const userRoutes = express.Router();

userRoutes.get('/data', userAuth, userController);

export default userRoutes;