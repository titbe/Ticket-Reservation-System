import express from "express";
import {
  addTicket,
  deleteTicket,
  getTickets,
  updateTicket,
} from "../controller/ticketController";

const router = express.Router();

router.get("/tickets", getTickets);
router.post("/tickets", addTicket);
router.put("/tickets/:id", updateTicket);
router.delete("/tickets/:id", deleteTicket);

export default router;
