import { RequestHandler } from 'express';
import { deleteEvent } from '../model/event.js';
import { sendDeletedEvent } from '../networking/message-queue.js';

export const deleteEventHandler: RequestHandler = (req, res) => {
  const id = req.query['id'] as string;
  deleteEvent(id);
  sendDeletedEvent(id);

  res.status(200);
  res.send();
};
