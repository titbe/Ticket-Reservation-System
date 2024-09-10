import Booking from "../model/Booking";
import Ticket from "../model/Ticket";

export const bookTicket = async (req, res) => {
  const { ticketId, username } = req.body;

  try {
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(400).json({ message: "Ticket not found" });
    }
    if (ticket.quantity === 0) {
      return res.status(400).json({ message: "Ticket not available" });
    }

    const newBooking = new Booking({});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  try {
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
