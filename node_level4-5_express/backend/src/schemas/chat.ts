import { Schema, Types } from "mongoose";

const chatSchema = new Schema({
  room: {
    type: Types.ObjectId,
    required: true,
    ref: "Room",
  },
  user: {
    type: String,
    required: true,
  },
  chat: String,
  gif: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default chatSchema;
