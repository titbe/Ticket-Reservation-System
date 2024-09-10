import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
  //tham chiếu đến id của Ticket model
  ticket: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Ticket",
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
  },
  bookingTime: {
    type: Date,
    default: Date.now,
  },

  //Trạng thái xác nhận thanh toán của booking
  confirmed: {
    type: Boolean,
    default: false,
  },

  //Cờ chỉ trạng thái hết hạn của booking
  expired: {
    type: Boolean,
    default: false,
  },

  pamentDetail: {
    amount: {
      type: Number,
      default: 0,
    },
    paymentTime: {
      type: Date,
    },

    //Phương thức thanh toán
    method: {
      type: String,
      default: "stripe",
    },

    //ID của PaymentIntent từ Stripe
    stripePaymentId: {
      type: String,
    },

    //Hoàn trả tiền
    refund: {
      amount: Number,
      refundTime: Date,
      stripeRefundId: String,
    },
  },
});

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
