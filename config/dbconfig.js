import mongoose from "mongoose";

let isConnected = false; // Track DB connection state

export const connectDb = async () => {
  if (isConnected) {
   
    return;
  }

  try {
    await mongoose.connect(process.env.DATABASE, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
 
  } catch (e) {
    console.log("Failed to connect to database:", e);
  }
};
