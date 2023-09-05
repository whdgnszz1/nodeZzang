import express from "express";
import {
  createRoom,
  deleteRoom,
  enterRoom,
  getRooms,
} from "../controllers/chats";
import { verifyToken } from "../middlewares/auth";
const router = express.Router();

router.post("/rooms", verifyToken, createRoom);
router.get("/rooms", getRooms);
router.get("/rooms/:roomId", verifyToken, enterRoom);
router.delete("/rooms/:roomId", verifyToken, deleteRoom);
export default router;
