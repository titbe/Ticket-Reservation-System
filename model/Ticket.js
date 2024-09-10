import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },

  //Tổng số lượng vé
  quantity: {
    type: Number,
    required: true,
  },

  //Số lượng vé đã đặt
  bookedQuantity: {
    type: Number,
    default: 0,
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
