import express from "express";
import {
  bookTicket,
  cancelBooking,
  confirmBooking,
} from "../controller/bookingCotroller.mjs";

const router = express.Router();

router.post("/book", bookTicket);
router.post("/confirm/:id", confirmBooking);
router.post("/cancel/:id", cancelBooking);

export default router;
