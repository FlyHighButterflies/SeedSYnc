import mongoose from "mongoose";

const tradeSchema = new mongoose.Schema({
  inventory: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: "Buyer", required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: "Farmer", required: true },
  quantity: { type: Number, required: true, min: 1 },
  totalPrice: { type: Number, required: true },
  status: { type: String, enum: ["pending", "completed", "cancelled"], default: "pending" },
  match: { type: mongoose.Schema.Types.ObjectId, ref: "Match" }, // Optional link to the original match
}, { timestamps: true });

const Trade = mongoose.model("Trade", tradeSchema);
export default Trade;