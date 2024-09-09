import Ticket from "../model/Ticket";

export const getTickets = async (req, res) => {
  try {
    const ticket = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const bookTicket = async (req, res) => {
  try {
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
