import mongoose from "mongoose";

const inventorySchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: "Crop", required: true },
  farmer: { type: mongoose.Schema.Types.ObjectId, ref: "Account", required: true },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, enum: ['kg', 'lbs', 'piece', 'bunch', 'item'] },
  price: { type: Number, required: true, min: 0 },
  certifications: [{ type: String }],
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: true
    }
  },
}, { timestamps: true });

inventorySchema.index({ location: '2dsphere' });

const Inventory = mongoose.model("Inventory", inventorySchema);
export default Inventory;
