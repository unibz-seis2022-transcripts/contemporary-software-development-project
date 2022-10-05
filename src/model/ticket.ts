import storage from 'node-persist';

export type Ticket = {
  id: string;
  eventId: string;
  soldOn: Date;
};

export const initTickets = async (): Promise<void> => {
  const hostStoragePath = './tickets.json';
  await storage.init({ dir: hostStoragePath, logging: true });
  const persistedTickets = (await storage.getItem('tickets')) || [];
  console.log(`Currently stored tickets: ${persistedTickets}`);
};
