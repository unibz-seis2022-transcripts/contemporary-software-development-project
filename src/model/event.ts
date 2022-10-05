import storage from 'node-persist';

export type Event = {
  id: string;
  name: string;
  date: Date;
  tickets: number;
};

let events: Event[] = [];
const EVENT_STORAGE_NAME = 'events';

export const initEvents = async (): Promise<void> => {
  const hostStoragePath = './events.json';
  await storage.init({ dir: hostStoragePath, logging: true });
  const events = (await storage.getItem(EVENT_STORAGE_NAME)) || [];
  console.log(`Currently stored events: ${events}`);
};

export const addEvent = (newEvent: Event): void => {
  if (events.find((event) => event.id === newEvent.id) !== undefined) {
    console.log(`Event with id ${newEvent.id} already registered`);
    return;
  }
  events.push(newEvent);
  storage.setItem(EVENT_STORAGE_NAME, events);
  console.log(`Added ${newEvent} to list of events`);
};
