import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true, trim: true },
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  role: { type: String, enum: ["farmer", "buyer", "admin"], default: "buyer" },
  profilePicture: { type: String },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
    }
  },
  preferences: {
    crop_types: [String],
    distance_radius_km: Number,
  },
  performance_score: { type: Number, default: 0 },
}, { timestamps: true });

// Index for geospatial queries
userSchema.index({ location: '2dsphere' });

const User = mongoose.model("User", userSchema);
export default User;
