import { RequestHandler } from 'express';
import { getEvents } from '../model/event.js';
import { Event } from '../types.js';

type EventResponse = Event & {
  ticketsRemaining: number;
};

export const getEventsHandler: RequestHandler = (req, res) => {
  const events = getEvents();
  const eventsToBeSent: EventResponse[] = events.map((event) => {
    return {
      ...event,
      ticketsRemaining: event.ticketsTotal - event.ticketsSold,
    };
  });

  return res.status(200).send({ events: eventsToBeSent });
};
