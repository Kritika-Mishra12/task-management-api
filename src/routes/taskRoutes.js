import express from 'express';
import { createTask, getTasks, updateTask, deleteTask } from "../controllers/taskController.js";
import auth from '../middlewares/auth.js';

const router = express.Router();

router.post("/createTask", auth(), createTask);
router.get("/getTasks", auth(), getTasks);
router.put("/updateTask/:id", auth(), updateTask);
router.delete("/deleteTask/:id", auth(), deleteTask);

export default router
