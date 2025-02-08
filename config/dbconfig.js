import mongoose from "mongoose";

export const connectDb = () => {
  const mongoUrl = `${process.env.DATABASE}`;
  mongoose
    .connect(mongoUrl)
    .then(() => {
      console.log("Connected to db");
    })
    .catch((e) => console.log("Failed to connect db" + e));
};

