import {
  Event,
  EventFromQueue,
  IndexedEvents,
  IndexedPersistedEvents,
} from '../types.js';
import { getItem, setItem } from './persist.js';

const eventsItemName = 'events';

let events: IndexedEvents;

export async function initEvents(): Promise<void> {
  events = {};
  const persistedEvents =
    (await getItem<IndexedPersistedEvents>(eventsItemName)) || {};

  Object.keys(persistedEvents).forEach((eventKey) => {
    const event = persistedEvents[eventKey];
    events[eventKey] = { ...event, date: new Date(event.date) };
  });
}

export function addEvent(event: EventFromQueue): string {
  events[event.id] = { ...event, date: new Date(event.date) };
  setItem<IndexedEvents>(eventsItemName, events);

  return event.id;
}

export function deleteEvent(id: string): void {
  delete events[id];
  setItem<IndexedEvents>(eventsItemName, events);
}

export class EventSoldOutError extends Error {
  constructor(event?: Event) {
    let errorMessage = 'Event sold out.';
    if (event) {
      errorMessage += ` Event with name "${event.name}" and id ${event.id} has no more tickets available.`;
    }

    super(errorMessage);
  }
}

export function reserveTicketForEvent(id: string): void {
  const event = events[id];

  if (event.ticketsSold + 1 > event.ticketsTotal) {
    throw new EventSoldOutError(event);
  }

  event.ticketsSold++;
  setItem<IndexedEvents>(eventsItemName, events);
}

export function searchTickets(desiredTickets: number, date: Date): Event[] {
  const foundEvents = Object.values(events).filter((event) => {
    const availableTickets = event.ticketsTotal - event.ticketsSold;
    const isSameDay = event.date.getTime() === date.getTime();
    const areEnoughTicketsAvailable = availableTickets >= desiredTickets;
    return isSameDay && areEnoughTicketsAvailable;
  });

  return foundEvents;
}

export function cancelTicketReservationForEvent(eventId: string): void {
  const event = events[eventId];
  if (event.ticketsSold > 0) {
    event.ticketsSold--;
  }
  setItem<IndexedEvents>(eventsItemName, events);
}
