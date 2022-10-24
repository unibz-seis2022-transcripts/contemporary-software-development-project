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

export type TicketRequest = {
  owner: string;
  eventId: string;
};

export type Ticket = TicketRequest & {
  id: string;
  soldOn: Date;
};

export type PersistedTicket = Omit<Ticket, 'soldOn'> & {
  soldOn: string;
};

export type IndexedTickets = { [id: string]: Ticket };
export type IndexedPersistedTickets = { [id: string]: PersistedTicket };
