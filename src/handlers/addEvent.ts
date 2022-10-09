import { RequestHandler } from 'express';
import { addEvent, DuplicateEventError } from '../model/event.js';
import { EventRequest } from '../types.js';

export const addEventHandler: RequestHandler = (req, res) => {
  const name = req.query['name'] as string;
  const date = req.query['date'] as string;
  const tickets = +req.query['tickets'];

  const eventRequest: EventRequest = {
    name,
    date,
    ticketsTotal: tickets,
  };

  let id: string;

  try {
    id = addEvent(eventRequest);
  } catch (error) {
    if (error instanceof DuplicateEventError) {
      return res.status(400).send(error.message);
    } else {
      console.log('An unexpected error occured: ', error);
      return res.status(500).send('An unexpected error occured.');
    }
  }

  return res.status(201).send({ eventId: id });
};
