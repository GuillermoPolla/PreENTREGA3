const Ticket = require('../models/Ticket');

class TicketRepository {
  async create(ticketData) {
    return await Ticket.create(ticketData);
  }
}

module.exports = new TicketRepository();
