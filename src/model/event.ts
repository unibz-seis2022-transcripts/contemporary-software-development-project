import {
  Event,
  EventRequest,
  IndexedEvents,
  IndexedPersistedEvents,
} from '../types.js';
import { v4 as uuid } from 'uuid';
import { initStorage, setItem } from './persist.js';

const eventsItemName = 'events';

let events: IndexedEvents;

export async function initEvents(): Promise<void> {
  events = {};
  const persistedEvents = await initStorage<IndexedPersistedEvents>(
    './storage/events',
    eventsItemName,
  );

  Object.keys(persistedEvents).forEach((eventKey) => {
    const event = persistedEvents[eventKey];
    events[eventKey] = { ...event, date: new Date(event.date) };
  });
}

export class DuplicateEventError extends Error {
  constructor(event?: EventRequest) {
    let errorMessage = 'Duplicate Event Error. ';
    if (event) {
      errorMessage += `Event with name "${event.name}" already exists on day ${event.date}.`;
    }

    super(errorMessage);
  }
}

function checkForDuplicateEvent(eventToBeAdded: EventRequest): void {
  const dateOfRequestedEvent = new Date(eventToBeAdded.date);
  const possibleDuplicateEvent = Object.values(events).find(
    (event) =>
      event.date.getTime() === dateOfRequestedEvent.getTime() &&
      event.name === eventToBeAdded.name,
  );

  if (possibleDuplicateEvent) {
    throw new DuplicateEventError(eventToBeAdded);
  }
}

export function addEvent(eventToBeAdded: EventRequest): string {
  checkForDuplicateEvent(eventToBeAdded);

  const id = uuid();

  const event: Event = {
    ...eventToBeAdded,
    id,
    date: new Date(eventToBeAdded.date),
    ticketsSold: 0,
  };
  events[id] = event;
  setItem<IndexedEvents>(eventsItemName, events);

  return id;
}

export function getEvents(): Event[] {
  return Object.values(events);
}

export function deleteEvent(id: string): void {
  delete events[id];
  setItem<IndexedEvents>(eventsItemName, events);
}

export class EventSoldOutError extends Error {
  constructor(event?: Event) {
    let errorMessage = 'Event sold out. ';
    if (event) {
      errorMessage += `Event with name "${event.name}" and id ${event.id} has no more tickets available.`;
    }

    super(errorMessage);
  }
}

export function reserveTicket(id: string): void {
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
