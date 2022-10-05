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
    tickets,
  };

  try {
    addEvent(event);
  } catch (error) {
    if (error instanceof DuplicateEventError) {
      res.send(error.message);
    } else {
      console.log('An unexpected error occured: ', error);
      res.send('An unexpected error occured.');
    }
  }

  res.send(`Created event with id: ${event.id}`);
};
