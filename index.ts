import express, { Express, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import routes from './routes';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
import './config/db';

const app: Express = express();

// Use express.json() to parse JSON request bodies
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: 'http://localhost:3000',
  })  
);

// app.options('*', cors()); // This will handle preflight requests

console.log("Environment:", process.env.NODE_ENV);
app.use(cookieParser());
app.use((req, res, next) => {
  console.log('Received request:', req.method, req.url);
  next();
});
// Mount routes under /api/v1
app.use("/api/",  routes);

// Start the server
const PORT: number = parseInt(process.env.PORT || '8080', 10);
app.listen(PORT, () => {
  console.log("Server is running on port " + PORT);
});
