import { RequestHandler } from 'express';
import { addEvent, DuplicateEventError } from '../model/event.js';
import { EventRequest } from '../types.js';

export const addEventHandler: RequestHandler = (req, res) => {
  const eventRequest: EventRequest = {
    name: req.query['name'] as string,
    date: req.query['date'] as string,
    ticketsTotal: +req.query['tickets'],
  };

  let id: string;

  try {
    id = addEvent(eventRequest);
  } catch (error) {
    if (error instanceof DuplicateEventError) {
      res.status(400);
      res.send('Duplicate Event Error.');
      return;
    } else {
      res.status(500);
      res.send('An unknown error occured.');
      return;
    }
  }

  res.status(201).send({ eventId: id });
  return;
};
