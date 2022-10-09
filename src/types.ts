export type Event = {
  id: string;
  name: string;
  date: Date;
  ticketsTotal: number;
  ticketsSold: number;
};

export type Ticket = {
  id: string;
  owner: string;
  eventId: string;
  soldOn: Date;
};
