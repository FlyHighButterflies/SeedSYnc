import mongoose from "mongoose";

const chatLogSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderType' },
  senderType: { type: String, required: true, enum: ['Farmer', 'Buyer'] },
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'recipientType' },
  recipientType: { type: String, required: true, enum: ['Farmer', 'Buyer'] },
  message: { type: String, required: true, trim: true },
  read: { type: Boolean, default: false },
  messageType: { type: String, enum: ['text', 'image', 'system'], default: 'text' },
}, { timestamps: true });

const ChatLog = mongoose.model("ChatLog", chatLogSchema);
export default ChatLog;