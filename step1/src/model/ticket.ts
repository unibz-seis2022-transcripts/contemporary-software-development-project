import storage from 'node-persist';

export type Ticket = {
  id: string;
  owner: string;
  eventId: string;
  soldOn: Date;
};

const TICKET_STORAGE_NAME = 'tickets';

const tickets: { [id: string]: Ticket } = {};

export const initTickets = async (): Promise<void> => {
  const hostStoragePath = './tickets.json';
  await storage.init({ dir: hostStoragePath, logging: true });
  const persistedTickets = (await storage.getItem(TICKET_STORAGE_NAME)) || {};

  Object.keys(persistedTickets).forEach((ticketKey) => {
    const ticket = persistedTickets[ticketKey];
    tickets[ticketKey] = { ...ticket, soldOn: new Date(ticket.date) };
  });

  console.log(`Currently stored tickets: ${JSON.stringify(persistedTickets)}`);
};

export const sellTicket = (ticket: Ticket) => {};
