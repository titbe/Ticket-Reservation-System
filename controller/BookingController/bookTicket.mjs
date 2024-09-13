import Booking from "../../model/Booking.mjs";
import Ticket from "../../model/Ticket.mjs";

export const bookTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { username, quantity } = req.body;

  try {
    const now = new Date();

    // Thực hiện logic đặt vé mới
    const ticket = await Ticket.findById(ticketId);
    if (!ticket) {
      return res.status(400).json({ message: "Ticket not found" });
    }
    if (ticket.quantity < quantity) {
      return res.status(400).json({ message: "Not enough tickets available" });
    }

    const bookingTime = new Date();

    // Tạo booking mới
    const newBooking = new Booking({
      ticket: ticketId,
      username,
      quantity,
      bookingTime,
      confirmed: false,
      paymentDetails: {},
    });

    await newBooking.save();

    // Giảm số lượng vé
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId, quantity: { $gte: quantity } },
      {
        $inc: { quantity: -quantity, bookedQuantity: quantity },
      },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(400).json({
        message: "Failed to update ticket.",
      });
    }

    // Tạo một hàm để xóa booking nếu không được xác nhận sau 5 phút 
    setTimeout(async () => {
      const expiredBooking = await Booking.findById(newBooking._id);

      // 
      if (expiredBooking && !expiredBooking.confirmed) {
        const ticket = await Ticket.findById(expiredBooking.ticket._id);
        // Dùng logic code này vì đây là hành động trong tương lai còn findOneAndUpdate là thao tác ngay lập tức đồng bộ với DataBase
        if (ticket) {
          // Hoàn lại số lượng vé
          ticket.quantity += expiredBooking.quantity;
          ticket.bookedQuantity -= expiredBooking.quantity;
          await ticket.save();
        }

        // Xóa booking hết hạn
        await Booking.findByIdAndDelete(expiredBooking._id);

      }
    }, 5 * 60 * 1000); // Thực hiện sau 5 phút

    res.status(200).json({
      message: "Ticket booked successfully",
      bookingId: newBooking._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
