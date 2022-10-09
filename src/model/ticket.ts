import {
  IndexedPersistedTickets,
  IndexedTickets,
  Ticket,
  TicketRequest,
} from '../types.js';
import { v4 as uuid } from 'uuid';
import { initStorage, setItem } from './persist.js';

const ticketsItemName = 'tickets';

let tickets: IndexedTickets = {};

export const initTickets = async (): Promise<void> => {
  tickets = {};
  const persistedTickets = await initStorage<IndexedPersistedTickets>(
    './storage/tickets',
    ticketsItemName,
  );

  Object.keys(persistedTickets).forEach((ticketKey) => {
    const ticket = persistedTickets[ticketKey];
    tickets[ticketKey] = { ...ticket, soldOn: new Date(ticket.date) };
  });
};

export const reserveTicket = (ticketRequest: TicketRequest): string => {
  const id = uuid();
  const ticket: Ticket = {
    ...ticketRequest,
    id,
    soldOn: new Date(),
  };
  tickets[id] = ticket;
  setItem<IndexedTickets>(ticketsItemName, tickets);

  return id;
};

export const deleteTicket = (ticketId: string): string => {
  const ticket = tickets[ticketId];
  const eventId = ticket.eventId;
  delete tickets[ticketId];

  return eventId;
};

export const getTickets = (): Ticket[] => {
  return Object.values(tickets);
};
