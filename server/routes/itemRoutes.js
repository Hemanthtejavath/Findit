import express from "express";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

import {
  createItem,
  deletItem,
  getItems,
  getItemById,
  myItems,
  updateItem,
  updateItemStatus,
  getCompletedItem,
} from "../controllers/itemController.js";
import upload from "../middleware/uploadMiddleware.js";

router.post("/", protect, upload.single("image"), createItem);
router.patch("/:id", protect, upload.single("image"), updateItem);
router.get("/", getItems);
router.get("/myItems", protect, myItems);
router.get("/completed", getCompletedItem);
router.get("/:id", getItemById);
router.patch("/:id/status", protect, updateItemStatus);
router.delete("/:id", protect, deletItem);

export default router;
