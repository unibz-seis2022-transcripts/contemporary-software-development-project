import storage from 'node-persist';

export type Event = {
  id: string;
  name: string;
  date: Date;
  ticketsTotal: number;
  ticketsSold: number;
};

const EVENT_STORAGE_NAME = 'events';

let events: Event[] = [];

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
  const persistedEvents = (await storage.getItem(EVENT_STORAGE_NAME)) || [];
  events = persistedEvents.map((event) => {
    return { ...event, date: new Date(event.date) };
  });
  console.log(`Currently stored events: ${JSON.stringify(events)}`);
};

const checkForDuplicateEvent = (newEvent: Event): void => {
  if (
    events.find(
      (event) =>
        event.date.getTime() === newEvent.date.getTime() &&
        event.name === newEvent.name,
    )
  ) {
    throw new DuplicateEventError(newEvent);
  }
};

export const addEvent = (newEvent: Event): void => {
  checkForDuplicateEvent(newEvent);

  events.push(newEvent);
  storage.setItem(EVENT_STORAGE_NAME, events);
  console.log(`Added ${JSON.stringify(newEvent)} to list of events`);
};

export const deleteEvent = (eventId: string): void => {
  const indexOfEvent = events.findIndex((event) => event.id === eventId);

  if (indexOfEvent === -1) {
    return;
  }
  events.splice(indexOfEvent);
  storage.setItem(EVENT_STORAGE_NAME, events);
};

export const getEvents = (): Event[] => {
  return events;
};
