import { RequestHandler } from 'express';
import { EventSoldOutError, reserveTicketForEvent } from '../model/event.js';
import { reserveTicket } from '../model/ticket.js';
import { sendReservedTicket } from '../networking/message-queue.js';
import { TicketRequest } from '../types.js';

export const reserveTicketHandler: RequestHandler = (req, res) => {
  const ticketRequest: TicketRequest = {
    owner: req.query['name'] as string,
    eventId: req.query['event'] as string,
  };

  try {
    reserveTicketForEvent(ticketRequest.eventId);
  } catch (error) {
    if (error instanceof EventSoldOutError) {
      const status = 400;
      res.status(status);
      res.send({ status, message: 'Event sold out' });
      return;
    }
    res.status(500);
    res.send('An unexpected error occured.');
    return;
  }

  const ticketId = reserveTicket(ticketRequest);
  sendReservedTicket(ticketRequest.eventId);

  res.send({ ticketId });
};
