import mongoose from 'mongoose';

// Ensure that process.env.MONGO_URL is properly typed
const url: string = process.env.MONGO_URL as string;
console.log("trying to connect to MongoDB...");
mongoose.connect(url)
  .then(() => {
 
    console.log("Connected to MongoDB");
  })
  .catch((err: Error) => {
    console.error("Error connecting to MongoDB", err);
  });
