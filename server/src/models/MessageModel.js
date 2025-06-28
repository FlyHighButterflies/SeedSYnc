import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'senderType' },
  senderType: { type: String, required: true, enum: ['Farmer', 'Buyer'] },
  recipient: { type: mongoose.Schema.Types.ObjectId, required: true, refPath: 'recipientType' },
  recipientType: { type: String, required: true, enum: ['Farmer', 'Buyer'] },
  message: { type: String, required: true, trim: true },
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);
export default Message;
