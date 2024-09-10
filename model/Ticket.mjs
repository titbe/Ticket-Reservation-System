import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    // min: [0, "Price must be at least 0"],
  },

  //Tổng số lượng vé
  quantity: {
    type: Number,
    required: true,
    // min: [0, "Quantity must be at least 0"],
  },

  //Số lượng vé đã đặt
  bookedQuantity: {
    type: Number,
    default: 0,
    // min: [0, "BookedQuantity must be at least 0"],
  },
});

const Ticket = mongoose.model("Ticket", ticketSchema);

export default Ticket;
