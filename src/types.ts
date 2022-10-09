export type EventRequest = {
  name: string;
  date: string;
  ticketsTotal: number;
};

export type Event = {
  id: string;
  name: string;
  date: Date;
  ticketsTotal: number;
  ticketsSold: number;
};

export type PersistedEvent = Omit<Event, 'date'> & {
  date: string;
};

export type IndexedEvents = { [id: string]: Event };
export type IndexedPersistedEvents = { [id: string]: PersistedEvent };

export type Ticket = {
  id: string;
  owner: string;
  eventId: string;
  soldOn: Date;
};
