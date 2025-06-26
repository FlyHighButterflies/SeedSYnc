import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
  cropId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Crop",
    required: true,
  },
  farmerId: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

InventorySchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const Inventory = mongoose.model("Inventory", InventorySchema);

export default Inventory;
