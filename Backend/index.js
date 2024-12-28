import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { ConnectDB } from './src/config/mongodb.js';
import authRoute from './src/routes/authRoute.js';
import userRoute from './src/routes/userRoute.js'

const app = express();
const port = process.env.PORT || 4000;

dotenv.config();

app.use(express.json());
app.use(cookieParser());
app.use(cors({
    credentials: true,
}));

app.use('/api/auth', authRoute);
app.use('/api/user', userRoute);

app.get('/', (req, res) => {
    res.send("API Working");
});

app.listen(port, () => {
    console.log(`App running on PORT ${port}`);
    ConnectDB();
});