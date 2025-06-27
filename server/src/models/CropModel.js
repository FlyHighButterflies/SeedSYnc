import mongoose from "mongoose";

const cropSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  description: { type: String, trim: true },
  category: { type: String, required: true, trim: true }, // e.g., 'Vegetable', 'Fruit', 'Tool', 'Seed'
  images: [{ type: String }],
}, { timestamps: true });

const Crop = mongoose.model("Crop", cropSchema);
export default Crop;
