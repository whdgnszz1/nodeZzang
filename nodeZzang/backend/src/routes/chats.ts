import express from "express";
import {
  createRoom,
  deleteRoom,
  enterRoom,
  getRooms,
} from "../controllers/chats";
import { ensureAuthenticated } from "../middlewares/ensureAuthenticated";
const router = express.Router();

router.post("/rooms", ensureAuthenticated, createRoom);
router.get("/rooms", getRooms);
router.post("/rooms/:roomId", ensureAuthenticated, enterRoom);
router.delete("/rooms/:roomId", ensureAuthenticated, deleteRoom);
export default router;
