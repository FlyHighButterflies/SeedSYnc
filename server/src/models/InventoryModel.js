import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true // 1:1 relationship with user
    },

    role: {
      type: String,
      enum: ["farmer", "buyer"],
      required: true
    },

    crops: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Crop"
      }
    ],

    createdAt: {
      type: Date,
      default: Date.now
    }
  }
);

const Inventory = mongoose.model("Inventory", inventorySchema);

export default Inventory;
