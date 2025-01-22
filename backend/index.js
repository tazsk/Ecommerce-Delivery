import express from 'express';
import connectDB from './config/db.js'
import productRoutes from './routes/ProductRoutes.js';
import authRoutes from './routes/AuthRoutes.js'
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const port = 4000;
const app =  express();
app.use(cors());

app.use(express.json());
app.use('/products', productRoutes);
app.use('/auth', authRoutes)

connectDB();

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});