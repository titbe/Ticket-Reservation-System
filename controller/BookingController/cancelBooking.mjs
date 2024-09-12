import Stripe from "stripe";

import dotenv from "dotenv";
import Booking from "../../model/Booking.mjs";
import Ticket from "../../model/Ticket.mjs";

dotenv.config();

const stripeClient = new Stripe(process.env.KEY_STRIPE_SECRET, {
  apiVersion: "2022-08-01",
});

export const cancelBooking = async (req, res) => {
  const { bookingId } = req.params;

  try {
    const booking = await Booking.findById(bookingId).populate("ticket");
    if (!booking) {
      return res.status(400).json({ message: "Booking not found" });
    }

    // Nếu vé đã được xác nhận, hoàn tiền 90%
    if (
      booking.confirmed &&
      booking.paymentDetail.amount > 0 &&
      booking.paymentDetail.method != "pending"
    ) {
      const refundAmount = booking.paymentDetail.amount * 0.9;

      // Tạo refund thông qua Stripe
      const refund = await stripeClient.refunds.create({
        payment_intent: booking.paymentDetail.stripePaymentId,
        amount: Math.round(refundAmount * 100), // Stripe tính theo cent
      });

      booking.paymentDetail.refund = {
        amount: refundAmount, //Đổi lại thành đơn vị tiền tệ (USD)
        refundTime: new Date(),
        stripeRefundId: refund.id,
      };

      await booking.save();
    } else {
      return res.status(400).json({
        message: "Booking is not confirmed or does not have payment details",
      });
    }

    // Cập nhật số lượng vé
    const updatedTicket = await Ticket.findOneAndUpdate(
      { _id: booking.ticket._id, quantity: { $gte: booking.quantity } }, // Đảm bảo số lượng vé hiện có >= số lượng vé ycau $gte là toán tử so sánh "greater than or equal"
      {
        $inc: { quantity: booking.quantity, bookedQuantity: -booking.quantity }, // Cập nhật vé
      },
      { new: true }
    );
    if (!updatedTicket) {
      return res.status(400).json({
        message: "Failed to update ticket.",
      });
    }

    // Xóa booking
    // await Booking.findByIdAndDelete(bookingId);

    res.status(200).json({ message: "Booking cancelled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
