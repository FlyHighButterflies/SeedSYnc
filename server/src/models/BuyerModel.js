import mongoose from "mongoose";

const buyerSchema = new mongoose.Schema({
  // Personal Information
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  profilePicture: { type: String },
  fcmToken: { type: String },

  // Location & Logistics (from SignUp.jsx Step 3)
  country: { type: String, trim: true },
  province: { type: String, trim: true },
  city: { type: String, trim: true },
  address: { type: String, trim: true },
  landmarks: { type: String, trim: true },
  highway: { type: String, enum: ['yes', 'no'] },
  port: { type: String, enum: ['yes', 'no'] },
  transportation: { type: String, enum: ['boat', 'truck', 'on-foot'] },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    }
  },

  // Buyer-specific data (from Profile.jsx sampleBuyerProfile & SignUp.jsx Step 4)
  productsNeeded: [{ type: String }],
  quantityRange: { type: String },
  urgency: { type: String, enum: ['immediate', 'soon', 'flexible'] },
  qualityStandards: [{ type: String }],
  frequency: { type: String, enum: ['weekly', 'monthly', 'quarterly'] },
  inventoryStatus: { type: String, enum: ['low', 'normal', 'sufficient'] },
  activeRequirements: { type: Number, default: 0 },
  totalRequirements: { type: Number, default: 0 },

  // General user stats (from Profile.jsx)
  joinDate: { type: Date, default: Date.now },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalTrades: { type: Number, default: 0 },

}, { timestamps: true });

buyerSchema.index({ location: '2dsphere' });

const Buyer = mongoose.model("Buyer", buyerSchema);
export default Buyer;
