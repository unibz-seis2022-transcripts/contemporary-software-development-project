import {
  IndexedPersistedTickets,
  IndexedTickets,
  Ticket,
  TicketRequest,
} from '../types.js';
import { v4 as uuid } from 'uuid';
import { getItem, setItem } from './persist.js';

const ticketsItemName = 'tickets';

let tickets: IndexedTickets = {};

export const initTickets = async (): Promise<void> => {
  tickets = {};
  const persistedTickets =
    (await getItem<IndexedPersistedTickets>(ticketsItemName)) || {};

  Object.keys(persistedTickets).forEach((ticketKey) => {
    const ticket = persistedTickets[ticketKey];
    tickets[ticketKey] = {
      ...ticket,
      soldOn: new Date(ticket.soldOn),
    };
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

  if (!ticket) {
    return '';
  }

  const eventId = ticket.eventId;
  delete tickets[ticketId];
  setItem<IndexedTickets>(ticketsItemName, tickets);

  return eventId;
};

export const deleteTicketsForEvent = (eventId: string): void => {
  const affectedTicketIds = Object.values(tickets)
    .filter((ticket) => ticket.eventId === eventId)
    .map((ticket) => ticket.id);
  affectedTicketIds.forEach((ticketId) => delete tickets[ticketId]);
  setItem<IndexedTickets>(ticketsItemName, tickets);
};

export const getTickets = (): Ticket[] => {
  return Object.values(tickets);
};
