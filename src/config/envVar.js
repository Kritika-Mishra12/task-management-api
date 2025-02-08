import dotenv from 'dotenv';
import { env } from 'process';

dotenv.config();


const envVar ={
    port:process.env.PORT,
    jwtSecret:process.env.JWT_SECRET,
    mongoose: {
        url: process.env.MONGODB_URL,
        options: {
        //   useCreateIndex: true,
          useNewUrlParser: true,
          useUnifiedTopology: true,
        },
      },
}

export default envVar