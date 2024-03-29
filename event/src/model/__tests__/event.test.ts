import {
  Event,
  EventRequest,
  IndexedPersistedEvents,
  PersistedEvent,
} from '../../types.js';
import {
  addEvent,
  getEvents,
  initEvents,
  deleteEvent,
  reserveTicketForEvent,
  cancelTicketReservationForEvent,
} from '../event.js';
import { v4 as uuid } from 'uuid';
import { getItem, setItem } from '../persist.js';

jest.mock('uuid');
jest.mock('../persist.js');

const loadEventsForTest = async (events: PersistedEvent[]): Promise<void> => {
  const indexedEvents: IndexedPersistedEvents = {};
  events.forEach((event) => {
    indexedEvents[event.id] = event;
  });

  jest.mocked(getItem).mockResolvedValueOnce(indexedEvents);
  await initEvents();
};

describe('event model', () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    await loadEventsForTest([degreeCeremonyPersisted]);
  });

  test('persisted events are loaded from a file', async () => {
    const testEvent: Partial<PersistedEvent> = {
      id: '1',
      name: 'this is a test event',
    };

    await loadEventsForTest([testEvent as PersistedEvent]);
    const actualEvents = getEvents();

    expect(actualEvents).toEqual(
      expect.arrayContaining([expect.objectContaining(testEvent)]),
    );
  });

  const degreeCeremonyRequest: EventRequest = {
    name: 'Degree ceremony',
    date: '2022-10-08',
    ticketsTotal: 1000,
  };

  const degreeCeremonyId = '1234';

  const degreeCeremony: Event = {
    ...degreeCeremonyRequest,
    id: degreeCeremonyId,
    date: new Date(degreeCeremonyRequest.date),
    ticketsSold: 0,
  };

  const degreeCeremonyPersisted: PersistedEvent = {
    ...degreeCeremony,
    date: degreeCeremonyRequest.date,
  };

  test('stored events can be retrieved', () => {
    const actualEvents = getEvents();
    expect(actualEvents).toEqual(
      expect.arrayContaining([expect.objectContaining(degreeCeremony)]),
    );
  });

  test('addEvent stores the event and returns it', async () => {
    await loadEventsForTest([]);

    const eventToBeAdded: EventRequest = {
      name: 'Degree ceremony',
      date: '2022-10-08',
      ticketsTotal: 1000,
    };

    jest.mocked(uuid).mockReturnValue(degreeCeremonyId);

    const actualEvent = addEvent(eventToBeAdded);
    const actualEvents = getEvents();

    const expectedEvent: Event = {
      ...eventToBeAdded,
      date: new Date(eventToBeAdded.date),
      id: degreeCeremonyId,
      ticketsSold: 0,
    };

    expect(actualEvent).toEqual(expectedEvent);
    expect(actualEvents).toHaveLength(1);
    expect(actualEvents).toEqual(
      expect.arrayContaining([expect.objectContaining(degreeCeremony)]),
    );
    expect(setItem).toHaveBeenCalledWith('events', { '1234': degreeCeremony });
  });

  test('trying to call addEvent with a duplicate event with same name and date throws an error', () => {
    const duplicateEventRequest: EventRequest = {
      name: 'Degree ceremony',
      date: '2022-10-08',
      ticketsTotal: 42,
    };

    expect(() => addEvent(duplicateEventRequest)).toThrow();
  });

  test('deleteEvent removes an event from storage', async () => {
    const anotherEventId = '5678';
    const anotherEvent: Partial<PersistedEvent> = {
      id: anotherEventId,
      name: 'Another event',
    };

    await loadEventsForTest([
      degreeCeremonyPersisted,
      anotherEvent as PersistedEvent,
    ]);

    deleteEvent(anotherEventId);
    const actualEvents = getEvents();

    expect(actualEvents).toHaveLength(1);
    expect(actualEvents).toEqual(
      expect.arrayContaining([expect.objectContaining(degreeCeremony)]),
    );
    expect(setItem).toHaveBeenCalledWith('events', { '1234': degreeCeremony });
  });

  test('calling reserveTicket increases the sold tickets by 1', () => {
    const degreeCeremonyWithSoldTicket: Event = {
      ...degreeCeremony,
      ticketsSold: 1,
    };

    reserveTicketForEvent(degreeCeremonyId);

    const actualEvents = getEvents();
    expect(actualEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining(degreeCeremonyWithSoldTicket),
      ]),
    );

    expect(setItem).toHaveBeenCalledWith('events', {
      '1234': degreeCeremonyWithSoldTicket,
    });
  });

  test('cancelTicketReservationForEvent decreases ticketsSold by 1', async () => {
    const degreeCeremonyWithNoTickets: Partial<PersistedEvent> = {
      ...degreeCeremonyPersisted,
      ticketsSold: 1000,
    };

    await loadEventsForTest([degreeCeremonyWithNoTickets as PersistedEvent]);

    cancelTicketReservationForEvent(degreeCeremonyWithNoTickets.id);

    const actualEvents = getEvents();
    expect(actualEvents).toHaveLength(1);
    expect(actualEvents[0].ticketsSold).toBe(999);
  });

  test('cancelTicketReservationForEvent does not change event if there are no sold tickets', async () => {
    cancelTicketReservationForEvent(degreeCeremonyId);

    const actualEvents = getEvents();
    expect(actualEvents).toHaveLength(1);
    expect(actualEvents[0].ticketsSold).toBe(0);
  });
});
