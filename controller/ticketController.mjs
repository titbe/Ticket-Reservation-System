import Booking from "../model/Booking.mjs";
import Ticket from "../model/Ticket.mjs";

export const getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find();
    res.status(200).json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const addTicket = async (req, res) => {
  const { name, price, quantity } = req.body;

  try {
    const newTicket = new Ticket({
      name,
      price,
      quantity,
    });

    await newTicket.save();
    res
      .status(201)
      .json({ message: "Ticket added successfully", ticket: newTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  try {
    const updateTicket = await Ticket.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    if (!updateTicket)
      return res.status(404).json({ message: "Ticket not found!!!" });

    res
      .status(200)
      .json({ message: "Ticket updated successfully", ticket: updateTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteTicket = async (req, res) => {
  const { id } = req.params;

  try {
    const deleteTicket = await Ticket.findByIdAndDelete(id);

    if (!deleteTicket)
      return res.status(404).json({ message: "Ticket not found!!!" });

    //Cập nhật số lượng vé đã đặt trong các booking
    await Booking.updateMany(
      {
        ticket: id,
      },
      { $set: { expired: true } }
    );

    res
      .status(200)
      .json({ message: "Ticket deleted successfully", ticket: deleteTicket });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
