import mongoose, { Schema } from "mongoose";

const chatSchema = new Schema({
  roomId: {
    type: String,
    required: true,
    ref: "Room",
  },
  userId: {
    type: Number,
    required: true,
  },
  nickname: {
    type: String,
    required: true
  },
  profileUrl: {
    type: String
  },
  message: String,
  gif: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Chat", chatSchema);
