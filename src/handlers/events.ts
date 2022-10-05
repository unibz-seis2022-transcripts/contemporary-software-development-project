import { RequestHandler } from 'express';
import { Event, getEvents } from '../model/event.js';

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
