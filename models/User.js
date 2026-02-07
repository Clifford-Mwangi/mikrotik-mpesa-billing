import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true },
    macAddress: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
    password: { type: String },
    activePlan: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Plan",
    },
    isConnected: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
