import Stripe from "stripe";
import Booking from "../model/Booking.mjs";
import Ticket from "../model/Ticket.mjs";

const stripeClient = Stripe(process.env.KEY_STRIPE_SECRET);

export const bookTicket = async (req, res) => {
  const { ticketId } = req.params;
  const { username, quantity } = req.body;

  try {
    const now = new Date();

    // Tự động hủy các booking đã hết hạn (quá 5 phút)
    const expiredBookings = await Booking.find({
      confirmed: false,
      bookingTime: { $lt: new Date(now - 5 * 60 * 1000) }, // Tìm các booking quá 5 phút chưa được xác nhận
    });

    for (const booking of expiredBookings) {
      const ticket = await Ticket.findById(booking.ticket._id);
      if (ticket) {
        ticket.quantity += booking.quantity; // Tăng lại số lượng vé đã bị giữ
        ticket.bookedQuantity -= booking.quantity; // Giảm bookedQuantity vì booking đã hết hạn
        await ticket.save();
      }

      // Xóa booking hết hạn
      await Booking.findByIdAndDelete(booking._id);

      // Xóa cookie liên quan
      res.clearCookie(`booking_${booking._id}`);
    }

    // Thực hiện logic đặt vé mới sau khi xử lý các booking hết hạn
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
      expired: false,
      paymentDetails: {},
    });

    await newBooking.save();

    // Giảm số lượng vé
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: ticketId, quantity: { $gte: quantity } }, // Đảm bảo số lượng vé hiện có >= số lượng vé ycau $gte là toán tử so sánh "greater than or equal" (lớn hơn hoặc bằng)
      {
        $inc: { quantity: -quantity, bookedQuantity: quantity }, // Atomic update
      },
      { new: true }
    );
    if (!updatedTicket) {
      return res
        .status(400)
        .json({
          message:
            "Failed to update ticket. It might have been booked by another request.",
        });
    }

    // Lưu thông tin thời gian vào cookie
    res.cookie(`booking_${newBooking._id}`, bookingTime.toISOString(), {
      maxAge: 5 * 60 * 1000, // Thời gian hết hạn cookie sau 5 phút
      httpOnly: true,
      signed: true, // Đảm bảo cookie được ký
    });

    res.status(200).json({
      message: "Ticket booked successfully",
      bookingId: newBooking._id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const confirmBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { paymentMethodId } = req.body;

  try {
    const booking = await Booking.findById(bookingId).populate("ticket");
    // const booking = await Booking.findById(bookingId);

    if (!booking || booking.confirmed) {
      return res
        .status(400)
        .json({ message: "Booking not found or already confirmed" }, booking);
    }

    // Lấy thời gian booking từ cookie
    const bookingTime = req.signedCookies[`booking_${bookingId}`];
    if (!bookingTime) {
      return res
        .status(400)
        .json({ message: "Booking expired or not found in cookie" });
    }

    const bookingTimeDate = new Date(bookingTime);
    const now = new Date();
    const timeDiff = now - bookingTimeDate;
    const timeLimit = 5 * 60 * 1000; // 5 phút

    // Nếu quá thời gian, hủy booking
    if (timeDiff > timeLimit) {
      res.clearCookie(`booking_${bookingId}`);
      await Booking.findByIdAndDelete(bookingId);

      const ticket = await Ticket.findById(booking.ticket._id);
      ticket.quantity += booking.quantity;
      ticket.bookedQuantity -= booking.quantity;
      await ticket.save();

      return res
        .status(400)
        .json({ message: "Booking confirmation time has expired" });
    }

    // Xác nhận thanh toán qua Stripe
    const totalPaymentAmount = booking.quantity * booking.ticket.price;
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(totalPaymentAmount * 100), // Stripe tính theo cent
      currency: "usd",
      payment_method: paymentMethodId,
      confirm: true,
    });

    if (paymentIntent.status !== "succeeded") {
      return res
        .status(400)
        .json({ message: "Payment failed", details: paymentIntent.status });
    }

    // Cập nhật thông tin thanh toán và xác nhận booking
    booking.confirmed = true;
    booking.paymentDetails = {
      amount: totalPaymentAmount,
      paymentTime: now,
      method: "stripe",
      stripePaymentId: paymentIntent.id,
    };

    await booking.save();

    res.clearCookie(`booking_${bookingId}`); // Xóa cookie khi đã thanh toán thành công
    res
      .status(200)
      .json({ message: "Booking confirmed and payment successful", booking });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId).populate("ticket");
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    // Nếu vé đã được xác nhận, hoàn tiền 90%
    if (booking.confirmed) {
      const refundAmount = booking.paymentDetails.amount * 0.9;

      // Tạo refund thông qua Stripe
      const refund = await stripeClient.refunds.create({
        paymentIntent: booking.paymentDetails.stripePaymentId,
        amount: Math.round(refundAmount * 100), // Stripe tính theo cent
      });

      booking.paymentDetails.refund = {
        amount: refundAmount, //Đổi lại thành đơn vị tiền tệ (USD)
        refundTime: new Date(),
        stripeRefundId: refund.id,
      };
    }

    // Xóa cookie khi hủy
    res.clearCookie(`booking_${bookingId}`);

    // Cập nhật số lượng vé
    const ticket = await Ticket.findById(booking.ticket._id);
    ticket.quantity += booking.quantity;
    ticket.bookedQuantity -= booking.quantity;
    await ticket.save();

    // Xóa booking
    await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
