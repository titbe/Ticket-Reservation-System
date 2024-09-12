import Ticket from "../../model/Ticket.mjs";

export const updateTicket = async (req, res) => {
  const { id } = req.params;
  const { price, quantity, bookedQuantity } = req.body;

  // Kiểm tra giá vs số lượng ko âm
  if (price < 0 || quantity < 0 || bookedQuantity < 0)
    return res.status(400).json({
      message:
        "Price or quantity or bookedQuantity must be greater than or equal to 0",
    });

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
