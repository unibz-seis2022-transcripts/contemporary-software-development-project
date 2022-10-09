import storage from 'node-persist';
import { Ticket } from '../types.js';

const TICKET_STORAGE_NAME = 'tickets';

const tickets: { [id: string]: Ticket } = {};

export const initTickets = async (): Promise<void> => {
  const hostStoragePath = './storage/tickets';
  await storage.init({ dir: hostStoragePath, logging: true });
  const persistedTickets = (await storage.getItem(TICKET_STORAGE_NAME)) || {};

  Object.keys(persistedTickets).forEach((ticketKey) => {
    const ticket = persistedTickets[ticketKey];
    tickets[ticketKey] = { ...ticket, soldOn: new Date(ticket.date) };
  });

  console.log(`Currently stored tickets: ${JSON.stringify(persistedTickets)}`);
};

export const sellTicket = (ticket: Ticket) => {};
