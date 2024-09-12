import Booking from "../../model/Booking.mjs";
import Ticket from "../../model/Ticket.mjs";

export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteTicket = await Ticket.findByIdAndDelete(id);

    if (!deleteTicket)
      return res.status(404).json({ message: "Ticket not found!!!" });

    res
      .status(200)
      .json({ message: "Ticket deleted successfully", ticket: deleteTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
