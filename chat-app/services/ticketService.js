const TicketRepository = require('../dao/repositories/ticketRepository');

class TicketService {
  async createTicket(data) {
    return await TicketRepository.create(data);
  }
}

module.exports = new TicketService();
