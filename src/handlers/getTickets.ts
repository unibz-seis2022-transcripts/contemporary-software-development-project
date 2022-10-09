import { RequestHandler } from 'express';
import { getTickets } from '../model/ticket.js';

export const getTicketsHandler: RequestHandler = (req, res) => {
  const tickets = getTickets();

  return res.status(200).send({ tickets });
};
