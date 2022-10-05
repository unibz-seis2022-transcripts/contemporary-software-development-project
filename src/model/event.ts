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
  const hostStoragePath = './storage/events';
  await storage.init({ dir: hostStoragePath, logging: true, encoding: 'utf8' });
  events = (await storage.getItem(EVENT_STORAGE_NAME)) || [];
  console.log(`Currently stored events: ${JSON.stringify(events)}`);
};

const checkForDuplicateEvent = (newEvent: Event): void => {
  if (
    events.find(
      (event) => event.date === newEvent.date && event.name === newEvent.name,
    )
  ) {
    // TODO: Create interface for duplicate event error
    throw new Error();
  }
};

export const addEvent = (newEvent: Event): void => {
  checkForDuplicateEvent(newEvent);

  events.push(newEvent);
  storage.setItem(EVENT_STORAGE_NAME, events);
  console.log(`Added ${JSON.stringify(newEvent)} to list of events`);
};
