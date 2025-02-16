import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Simpan sebagai hash
  role: { type: Number, enum: [1, 2], required: true } // 1 = Manager, 2 = Admin
});

export default mongoose.model("User", UserSchema);
