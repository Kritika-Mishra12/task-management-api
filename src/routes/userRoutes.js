import express from 'express';
import { getUsers } from '../controllers/userController.js';
import auth from '../middlewares/auth.js';
const router = express.Router();
router.get("/getUsers",auth(), getUsers);

export default router;