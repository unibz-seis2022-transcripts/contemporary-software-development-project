import storage from 'node-persist';
import { Event } from '../types.js';

const EVENT_STORAGE_NAME = 'events';

const events: { [id: string]: Event } = {};

export class DuplicateEventError extends Error {
  constructor(event?: Event) {
    let errorMessage = 'Duplicate Event Error. ';
    if (event) {
      errorMessage += `Event with name "${
        event.name
      }" already exists on day ${event.date.toDateString()}.`;
    }

    super(errorMessage);
  }
}

export const initEvents = async (): Promise<void> => {
  const hostStoragePath = './storage/events';
  await storage.init({ dir: hostStoragePath, logging: true, encoding: 'utf8' });
  const persistedEvents = (await storage.getItem(EVENT_STORAGE_NAME)) || {};

  Object.keys(persistedEvents).forEach((eventKey) => {
    events[eventKey] = {
      ...persistedEvents[eventKey],
      date: new Date(persistedEvents[eventKey].date),
    };
  });

  console.log(`Currently stored events: ${JSON.stringify(events)}`);
};

const checkForDuplicateEvent = (newEvent: Event): void => {
  const possibleDuplicate = Object.values(events).find(
    (event) =>
      event.date.getTime() === newEvent.date.getTime() &&
      event.name === newEvent.name,
  );

  if (possibleDuplicate) {
    throw new DuplicateEventError(newEvent);
  }
};

export const addEvent = (newEvent: Event): void => {
  checkForDuplicateEvent(newEvent);

  events[newEvent.id] = newEvent;
  storage.setItem(EVENT_STORAGE_NAME, events);
  console.log(`Added ${JSON.stringify(newEvent)} to list of events`);
};

export const deleteEvent = (eventId: string): void => {
  delete events[eventId];
  storage.setItem(EVENT_STORAGE_NAME, events);
};

export const getEvents = (): Event[] => {
  return Object.values(events);
};
