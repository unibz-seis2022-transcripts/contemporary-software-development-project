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
  reserveTicket,
  searchTickets,
} from '../event.js';
import { v4 as uuid } from 'uuid';
import { initStorage, setItem } from '../persist.js';

jest.mock('uuid');
jest.mock('../persist.js');

const loadEvents = async (events: PersistedEvent[]) => {
  const indexedEvents: IndexedPersistedEvents = {};
  events.forEach((event) => {
    indexedEvents[event.id] = event;
  });

  jest.mocked(initStorage).mockResolvedValueOnce(indexedEvents);
  await initEvents();
};

describe('event model', () => {
  beforeEach(async () => {
    jest.clearAllMocks();

    await loadEvents([degreeCeremonyPersisted]);
  });

  test('persisted events are loaded from a file', async () => {
    const testEvent: Partial<PersistedEvent> = {
      id: '1',
      name: 'this is a test event',
    };

    await loadEvents([testEvent as PersistedEvent]);
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

  const degreeCeremonyPersisted = {
    ...degreeCeremony,
    date: degreeCeremonyRequest.date,
  };

  test('stored events can be retrieved', () => {
    const actualEvents = getEvents();
    expect(actualEvents).toEqual(
      expect.arrayContaining([expect.objectContaining(degreeCeremony)]),
    );
  });

  test('addEvent stores the event and returns its id', async () => {
    await loadEvents([]);

    const eventToBeAdded: EventRequest = {
      name: 'Degree ceremony',
      date: '2022-10-08',
      ticketsTotal: 1000,
    };

    jest.mocked(uuid).mockReturnValue(degreeCeremonyId);

    const actualEventId = addEvent(eventToBeAdded);
    const actualEvents = getEvents();

    expect(actualEventId).toEqual(degreeCeremonyId);
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

    expect(() => addEvent(duplicateEventRequest)).toThrowError();
  });

  test('deleteEvent removes an event from storage', async () => {
    const anotherEventId = '5678';
    const anotherEvent: Partial<PersistedEvent> = {
      id: anotherEventId,
      name: 'Another event',
    };

    await loadEvents([degreeCeremonyPersisted, anotherEvent as PersistedEvent]);

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

    reserveTicket(degreeCeremonyId);

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

  test('calling reserveTicket with no more tickets available throws an error', async () => {
    const degreeCeremonyWithNoMoreTickets: PersistedEvent = {
      ...degreeCeremonyPersisted,
      ticketsSold: 1000,
    };
    await loadEvents([degreeCeremonyWithNoMoreTickets]);

    expect(() => reserveTicket(degreeCeremonyId)).toThrowError();
  });

  test('searchTickets returns events on the requested day with at least the requested tickets left', async () => {
    const event1Persist: Partial<PersistedEvent> = {
      id: '1',
      date: '2022-10-08',
      ticketsTotal: 10,
      ticketsSold: 9,
    };
    const event2Persist: Partial<PersistedEvent> = {
      id: '2',
      date: '2022-10-08',
      ticketsTotal: 10,
      ticketsSold: 8,
    };
    const event2: Partial<Event> = {
      ...event2Persist,
      date: new Date(event2Persist.date),
    };
    const event3Persist: Partial<PersistedEvent> = {
      id: '3',
      date: '2022-10-08',
      ticketsTotal: 10,
      ticketsSold: 7,
    };
    const event3: Partial<Event> = {
      ...event3Persist,
      date: new Date(event3Persist.date),
    };
    const eventOnAnotherDayPersist: Partial<PersistedEvent> = {
      id: '4',
      date: '2022-10-09',
      ticketsTotal: 10,
      ticketsSold: 0,
    };

    await loadEvents([
      event1Persist,
      event2Persist,
      event3Persist,
      eventOnAnotherDayPersist,
    ] as PersistedEvent[]);

    const actualEvents = searchTickets(2, new Date('2022-10-08'));

    expect(actualEvents).toHaveLength(2);
    expect(actualEvents).toEqual(
      expect.arrayContaining([
        expect.objectContaining(event2),
        expect.objectContaining(event3),
      ]),
    );
  });
});
