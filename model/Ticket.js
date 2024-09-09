import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: String,
  price: Number,
  available: Boolean,
  bookingDetails: {
    userName: String,
    bookingTime: Date,
    confirmed: Boolean,
    paymentDetails: {
      paymentTime: Date,
      paidAmount: Number,
    },
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
