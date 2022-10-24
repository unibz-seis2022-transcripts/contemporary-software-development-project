import { RequestHandler } from 'express';
import { deleteEvent } from '../model/event.js';
import { deleteTicketsForEvent } from '../model/ticket.js';

export const deleteEventHandler: RequestHandler = (req, res) => {
  const id = req.query['id'] as string;
  deleteEvent(id);
  deleteTicketsForEvent(id);

  res.status(200);
  res.send();
};
