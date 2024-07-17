const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const TicketSchema = new mongoose.Schema({
  code: { type: String, default: uuidv4, unique: true },
  purchase_datetime: { type: Date, default: Date.now },
  amount: Number,
  purchaser: String
});

const Ticket = mongoose.model('Ticket', TicketSchema);

module.exports = Ticket;
