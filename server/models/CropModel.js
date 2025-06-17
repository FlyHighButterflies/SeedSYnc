crop.js
const mongoose = require('mongoose');

const cropSchema = new mongoose.Schema({
  farmer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  quantity: {
    amount: {
      type: Number,
      required: true
    },
    unit: {
      type: String,
      required: true
    }
  },
  price: {
    amount: {
      type: Number,
      required: true
    },
    currency: {
      type: String,
      default: 'PHP'
    }
  },
  images: [{
    url: String,
    caption: String
  }],
  description: String,
  harvestDate: Date,
  status: {
    type: String,
    enum: ['available', 'reserved', 'sold'],
    default: 'available'
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: [Number] // [longitude, latitude]
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

cropSchema.index({ location: "2dsphere" });
cropSchema.index({ name: "text", description: "text" });

module.exports = mongoose.model('Crop', cropSchema);