import express from 'express';
import bodyParser from 'body-parser';
import connectDB from './config/db.js';
import authRoutes from './routes/user.js';
import movieRoutes from './routes/movie.js';
import cors from 'cors';
const app = express();

// Middleware
app.use(express.json());

connectDB();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());
app.use('/user', authRoutes);
app.use('/movie', movieRoutes);
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});