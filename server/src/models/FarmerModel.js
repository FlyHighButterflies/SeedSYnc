import mongoose from "mongoose";

const farmerSchema = new mongoose.Schema({
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

  // Farmer-specific data (from Profile.jsx sampleFarmerProfile & SignUp.jsx commented section)
  specialties: [{ type: String }],
  certifications: [{ type: String }],
  farmingPractices: [{ type: String }],
  totalCrops: { type: Number, default: 0 },
  activeCrops: { type: Number, default: 0 },
  surplus: { type: String, enum: ['yes', 'no'] },
  cropDiversityCount: { type: Number, default: 0 },
  cropsInPossession: [{ type: String }], // Assuming this is a list of crop names/types
  availableProduct: [{ type: String }], // Assuming this is a list of product names/types

  // General user stats (from Profile.jsx)
  joinDate: { type: Date, default: Date.now },
  rating: { type: Number, default: 0, min: 0, max: 5 },
  totalTrades: { type: Number, default: 0 },

}, { timestamps: true });

farmerSchema.index({ location: '2dsphere' });

const Farmer = mongoose.model("Farmer", farmerSchema);
export default Farmer;
