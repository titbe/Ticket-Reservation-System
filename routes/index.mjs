import express from "express";
import ticketRoutes from "./ticketRoutes.mjs"
import bookingRoutes from "./bookingRoutes.mjs"

const router = express.Router();

router.use( ticketRoutes);
router.use( bookingRoutes);

export default router;
