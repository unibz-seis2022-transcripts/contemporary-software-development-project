import { RequestHandler } from 'express';
import { deleteEvent } from '../model/event.js';

export const deleteEventHandler: RequestHandler = (req, res) => {
  const id = req.query['id'] as string;
  deleteEvent(id);
  // TODO (2022-11-23): Delete tickets for this event

  res.status(200);
  res.send();
};
