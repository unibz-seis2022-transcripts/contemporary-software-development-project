import { RequestHandler } from 'express';
import { searchTickets } from '../model/event.js';

export const searchTicketsHandler: RequestHandler = (req, res) => {
  const date = req.query['date'] as string;
  const tickets = +req.query['tickets'];

  const events = searchTickets(tickets, new Date(date));

  return res.status(200).send({ events });
};
