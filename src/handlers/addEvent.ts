import { RequestHandler } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { addEvent, DuplicateEventError, Event } from '../model/event.js';

export const addEventHandler: RequestHandler = (req, res) => {
  const name = req.query['name'] as string;
  const date = new Date(req.query['date'] as string);
  const tickets = +req.query['tickets'];

  const event: Event = {
    id: uuidv4(),
    name,
    date,
    ticketsTotal: tickets,
    ticketsSold: 0,
  };

  try {
    addEvent(event);
  } catch (error) {
    if (error instanceof DuplicateEventError) {
      return res.status(400).send(error.message);
    } else {
      console.log('An unexpected error occured: ', error);
      return res.status(500).send('An unexpected error occured.');
    }
  }

  return res.status(201).send({ eventId: event.id });
};
