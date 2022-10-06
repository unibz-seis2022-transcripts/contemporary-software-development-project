import { RequestHandler } from 'express';
import { deleteEvent } from '../model/event.js';

export const deleteEventHandler: RequestHandler = (req, res) => {
  const id = req.query['id'] as string;
  deleteEvent(id);

  return res.status(200).send();
};
