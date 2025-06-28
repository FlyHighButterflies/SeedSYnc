import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema({
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'recipientType' },
  recipientType: { type: String, required: true, enum: ['Farmer', 'Buyer'] },
  type: { type: String, required: true, enum: ['match_found', 'new_review', 'trade_update', 'system_alert', 'message'] },
  message: { type: String, required: true, trim: true },
  relatedEntity: { type: mongoose.Schema.Types.ObjectId, refPath: 'relatedEntityType' },
  relatedEntityType: { type: String, enum: ['Match', 'Trade', 'Review', 'Message'] },
  read: { type: Boolean, default: false },
}, { timestamps: true });

const Notification = mongoose.model("Notification", notificationSchema);
export default Notification;