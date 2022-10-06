import storage from 'node-persist';

export type Ticket = {
  id: string;
  owner: string;
  eventId: string;
  soldOn: Date;
};

const TICKET_STORAGE_NAME = 'tickets';

let tickets: Ticket[] = [];

export const initTickets = async (): Promise<void> => {
  const hostStoragePath = './tickets.json';
  await storage.init({ dir: hostStoragePath, logging: true });
  const persistedTickets = (await storage.getItem(TICKET_STORAGE_NAME)) || [];
  tickets = persistedTickets.map((ticket) => {
    return { ...ticket, soldOn: new Date(ticket.soldOn) };
  });
  console.log(`Currently stored tickets: ${persistedTickets}`);
};

export const sellTicket = (ticket: Ticket) => {};
