import express from "express";
import {
  bookTicket,
  cancelBooking,
  confirmBooking,
} from "../controller/bookingCotroller.mjs";

const router = express.Router();

router.post("/book/:ticketId", bookTicket);
router.post("/confirm/:bookingId", confirmBooking);
router.post("/cancel/:bookingId", cancelBooking);

export default router;
