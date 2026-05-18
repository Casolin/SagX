import { Router } from "express";
import { create, getAll, getOne, updateStock } from "./material.controller.js";
import { authMiddleware } from "../../middlewares/auth.middleware.js";

const router = Router();

router.post("/", authMiddleware, create);
router.get("/", authMiddleware, getAll);
router.get("/:id", authMiddleware, getOne);
router.patch("/:id/stock", authMiddleware, updateStock);

export default router;
