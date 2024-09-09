import express from "express";
import { bookTicket, cancelBooking, confirmBooking, getTickets } from "../controller/ticketController";

const router = express.Router();

router.get("/", getTickets);
router.post("/book", bookTicket);
router.post("/confirm/:id", confirmBooking);
router.post("/cancel/:id", cancelBooking);

export default router;
