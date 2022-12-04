import { RequestHandler } from 'express';
import { cancelTicketReservationForEvent } from '../model/event.js';
import { deleteTicket } from '../model/ticket.js';
import { sendCancelledTicket } from '../networking/message-queue.js';

export const deleteTicketHandler: RequestHandler = (req, res) => {
  const ticketId = req.query['id'] as string;
  const eventId = deleteTicket(ticketId);

  if (eventId) {
    cancelTicketReservationForEvent(eventId);
    sendCancelledTicket(eventId);
  }

  return res.status(200).send();
};
