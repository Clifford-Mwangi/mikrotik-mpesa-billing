import mongoose from "mongoose";

const planSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    price: { type: Number, required: true },
    durationHours: { type: Number, required: true }, // e.g. 1, 4, 24
  },
  { timestamps: true }
);

export default mongoose.model("Plan", planSchema);
