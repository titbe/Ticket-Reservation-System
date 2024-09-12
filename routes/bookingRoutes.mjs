import express from "express";
import { bookTicket } from "../controller/BookingController/bookTicket.mjs";
import { confirmBooking } from "../controller/BookingController/confirmBooking.mjs";
import { cancelBooking } from "../controller/BookingController/cancelBooking.mjs";


const router = express.Router();

router.post("/book/:ticketId", bookTicket);
router.post("/confirm/:bookingId", confirmBooking);
router.post("/cancel/:bookingId", cancelBooking);

export default router;
