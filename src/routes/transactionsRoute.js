import express from "express";

import {
  createTransaction,
  deleteTransactionById,
  getSummary,
  getTransactionByUserId,
} from "../controllers/transactionController.js";

const router = express.Router();

router.post("/", createTransaction);

router.get("/:userId", getTransactionByUserId);

router.delete("/:id", deleteTransactionById);

router.get("/summary/:id", getSummary);

export default router;
