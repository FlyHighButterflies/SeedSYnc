import mongoose from "mongoose";

const accountSchema = new mongoose.Schema({
  // Common Personal Information
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  contactNumber: { type: String, required: true, trim: true },
  profilePicture: { type: String },
  fcmToken: { type: String },
  role: { type: String, enum: ['Farmer', 'Buyer', 'Admin'], required: true },

  // Common Location & Logistics
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

  // Farmer-specific data (optional for Buyers)
  specialties: [{ type: String }],
  certifications: [{ type: String }],
  farmingPractices: [{ type: String }],
  totalCrops: { type: Number, default: 0 },
  activeCrops: { type: Number, default: 0 },
  surplus: { type: String, enum: ['yes', 'no'] },
  cropDiversityCount: { type: Number, default: 0 },
  cropsInPossession: [{ type: String }],
  availableProduct: [{ type: String }],

  // Buyer-specific data (optional for Farmers)
  productsNeeded: [{ type: String }],
  quantityRange: { type: String },
  urgency: { type: String, enum: ['immediate', 'soon', 'flexible'] },
  qualityStandards: [{ type: String }],
  frequency: { type: String, enum: ['weekly', 'monthly', 'quarterly'] },
  inventoryStatus: { type: String, enum: ['low', 'normal', 'sufficient'] },
  activeRequirements: { type: Number, default: 0 },
  totalRequirements: { type: Number, default: 0 },

  // Common General user stats
  joinDate: { type: Date, default: Date.now },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalTrades: { type: Number, default: 0 },

}, { timestamps: true });

accountSchema.index({ location: '2dsphere' });

const Account = mongoose.model("Account", accountSchema);
export default Account;
