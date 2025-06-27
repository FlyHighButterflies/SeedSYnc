import mongoose from "mongoose";

const matchSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    inventory: { type: mongoose.Schema.Types.ObjectId, ref: "Inventory", required: true },
    match_score: { type: Number, required: true },
    status: { type: String, enum: ['suggested', 'accepted', 'rejected'], default: 'suggested' },
    expires_at: { type: Date, required: true },
}, { timestamps: true });

const Match = mongoose.model("Match", matchSchema);
export default Match;
