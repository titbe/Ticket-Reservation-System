import express from "express";
import { getTickets } from "../controller/TicketController/getTickets.mjs";
import { addTicket } from "../controller/TicketController/addTicket.mjs";
import { updateTicket } from "../controller/TicketController/updateTicket.mjs";
import { deleteTicket } from "../controller/TicketController/deleteTicket.mjs";


const router = express.Router();

router.get("/tickets", getTickets);
router.post("/tickets", addTicket);
router.put("/tickets/:id", updateTicket);
router.delete("/tickets/:id", deleteTicket);

export default router;
