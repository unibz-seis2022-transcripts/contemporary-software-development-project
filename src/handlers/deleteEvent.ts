import { RequestHandler } from 'express';
import { deleteEvent } from '../model/event.js';
import { deleteTicket, getTickets } from '../model/ticket.js';

export const deleteEventHandler: RequestHandler = (req, res) => {
  const id = req.query['id'] as string;
  deleteEvent(id);

  const affectedTicketIds = getTickets()
    .filter((ticket) => ticket.eventId === id)
    .map((ticket) => ticket.id);
  affectedTicketIds.forEach((ticketId) => deleteTicket(ticketId));

  return res.status(200).send();
};
