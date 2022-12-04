import { RequestHandler } from 'express';
import { addEvent, DuplicateEventError } from '../model/event.js';
import { sendCreatedEvent } from '../networking/message-queue.js';
import { Event, EventRequest } from '../types.js';

export const addEventHandler: RequestHandler = (req, res) => {
  const eventRequest: EventRequest = {
    name: req.query['name'] as string,
    date: req.query['date'] as string,
    ticketsTotal: +req.query['tickets'],
  };

  let event: Event;

  try {
    event = addEvent(eventRequest);
  } catch (error) {
    if (error instanceof DuplicateEventError) {
      res.status(400);
      res.send('Duplicate Event Error.');
      return;
    } else {
      console.log('An unknown error occured: ', error);
      res.status(500);
      res.send('An unknown error occured.');
      return;
    }
  }

  sendCreatedEvent(event);

  res.status(201).send({ eventId: event.id });
  return;
};
