import { RequestHandler } from 'express';
import { EventSoldOutError, reserveTicketForEvent } from '../model/event.js';
import { reserveTicket } from '../model/ticket.js';

export const reserveTicketHandler: RequestHandler = (req, res) => {
  const eventId = req.query['event'] as string;
  const owner = req.query['name'] as string;

  try {
    reserveTicketForEvent(eventId);
  } catch (error) {
    if (error instanceof EventSoldOutError) {
      return res.status(400).send(error.message);
    } else {
      console.log('An unexpected error occured: ', error);
      return res.status(500).send('An unexpected error occured.');
    }
  }

  const ticketId = reserveTicket({ owner, eventId });
  return res.status(201).send({ ticketId });
};
