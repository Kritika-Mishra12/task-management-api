import express from "express";

import http from "http";
import { Server } from "socket.io";
import cors from "cors";
import jwtStrategy from './config/passport.js';
import passport from 'passport';
import envVar from '../src/config/envVar.js'
import mongoose from "mongoose";
import authRoutes from '../src/routes/authRoutes.js'
import adminRoutes from '../src/routes/adminRoutes.js'
import userRoutes from '../src/routes/userRoutes.js'
import taskRoutes from '../src/routes/taskRoutes.js'

mongoose.connect(envVar.mongoose.url, envVar.mongoose.options).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", 
    methods: ["GET", "POST"],
  },
});
app.use(cors());
app.use(express.json());
app.get("/",(req,res)=>{
  res.send('hddhasdkjsdkj')
})
app.use('/v1/auth', authRoutes);
app.use('/v1/admin', adminRoutes);
app.use('/v1/user', userRoutes);
app.use('/v1/task', taskRoutes);
app.use(passport.initialize());
passport.use('jwt', jwtStrategy);

io.on("connection", (socket) => {
  console.log("a user connected");
  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const PORT = envVar.port || 3002;
server.listen(PORT, () => {
  console.log(`Serveris running on port ${PORT}`);
});




