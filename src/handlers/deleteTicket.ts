import { RequestHandler } from 'express';
import { deleteTicketForEvent } from '../model/event.js';
import { deleteTicket } from '../model/ticket.js';

export const deleteTicketHandler: RequestHandler = (req, res) => {
  const ticketId = req.query['id'] as string;
  const eventId = deleteTicket(ticketId);

  if (eventId) {
    deleteTicketForEvent(eventId);
  }

  return res.status(200).send();
};
