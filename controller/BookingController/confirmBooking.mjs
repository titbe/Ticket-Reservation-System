import Stripe from "stripe";

import dotenv from "dotenv";
import Booking from "../../model/Booking.mjs";
import Ticket from "../../model/Ticket.mjs";

dotenv.config();

const stripeClient = new Stripe(process.env.KEY_STRIPE_SECRET, {
  apiVersion: "2022-08-01",
});

export const confirmBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { paymentMethodId } = req.body; // Lấy paymentMethodId từ request body

  try {
    const booking = await Booking.findById(bookingId).populate("ticket");
    if (!booking || booking.confirmed) {
      return res
        .status(400)
        .json({ message: "Booking not found or already confirmed" });
    }

    // Tạo Payment Intent và xác nhận thanh toán
    const totalPaymentAmount = booking.quantity * booking.ticket.price;
    const paymentIntent = await stripeClient.paymentIntents.create({
      amount: Math.round(totalPaymentAmount * 100), // Stripe tính theo cent
      currency: "usd",
      payment_method: paymentMethodId, // Thêm paymentMethodId từ client
      confirm: true, // Xác nhận ngay sau khi tạo Payment Intent
      automatic_payment_methods: { enabled: true, allow_redirects: "never" },
    });

    // Kiểm tra trạng thái thanh toán
    if (paymentIntent.status === "succeeded") {
      booking.confirmed = true;
      booking.paymentDetail = {
        amount: booking.quantity * booking.ticket.price,
        paymentTime: new Date(),
        method: "stripe",
        stripePaymentId: paymentIntent.id,
      };

      await booking.save();

      return res
        .status(200)
        .json({ message: "Booking confirmed and payment successful" });
    } else {
      return res
        .status(400)
        .json({ message: "Payment failed", details: paymentIntent.status });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
