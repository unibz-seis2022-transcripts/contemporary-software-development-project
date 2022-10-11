import { RequestHandler } from 'express';
import { EventSoldOutError, reserveTicketForEvent } from '../model/event.js';
import { reserveTicket } from '../model/ticket.js';
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
      res.status(400);
      res.send('Event sold out.');
      return;
    }
    res.status(500);
    res.send('An unexpected error occured.');
    return;
  }

  const ticketId = reserveTicket(ticketRequest);

  res.send({ ticketId });
};
