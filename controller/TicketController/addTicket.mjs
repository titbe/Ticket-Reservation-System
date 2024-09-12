import Ticket from "../../model/Ticket.mjs";

export const addTicket = async (req, res) => {
  const { name, price, quantity } = req.body;

  try {
    // Kiểm tra nếu trùng tên vé thì lỗi
    const existingTicket = await Ticket.findOne({ name });
    if (existingTicket) {
      return res
        .status(400)
        .json({ message: "A ticket with this name already exists" });
    }

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
