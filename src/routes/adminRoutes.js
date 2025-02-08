import express from 'express';
import { createUser, deleteUser, getUser, updateUser } from '../controllers/adminController.js';
import auth from '../middlewares/auth.js';
const router = express.Router();

router.post('/createUser', auth('admin'), createUser);
router.get("/getUser/:id", auth('admin'), getUser);
router.put("/updateUser/:id", auth('admin'), updateUser);
router.delete("/deleteuser/:id", auth('admin'), deleteUser);

export default router;