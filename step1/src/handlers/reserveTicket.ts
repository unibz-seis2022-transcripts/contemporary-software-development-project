import { RequestHandler } from 'express';

const reserveTicketHandler: RequestHandler = (req, res) => {
  const eventId = req.query['id'] as string;
  const customerName = req.query['name'] as string;
};
