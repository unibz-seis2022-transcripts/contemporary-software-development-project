import { Event, IndexedPersistedEvents, PersistedEvent } from '../../types.js';
import {
  addEvent,
  initEvents,
  deleteEvent,
  reserveTicketForEvent,
  searchTickets,
  cancelTicketReservationForEvent,
} from '../event.js';
import { getItem, setItem } from '../persist.js';

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

  const degreeCeremonyId = '1234';

  const degreeCeremony: Event = {
    name: 'Degree ceremony',
    ticketsTotal: 1000,
    id: degreeCeremonyId,
    date: new Date('2022-10-08'),
    ticketsSold: 0,
  };

  const degreeCeremonyPersisted: PersistedEvent = {
    ...degreeCeremony,
    date: '2022-10-08',
  };

  test('addEvent stores the event and returns its id', async () => {
    await loadEventsForTest([]);

    const actualEventId = addEvent(degreeCeremony);

    expect(actualEventId).toEqual(degreeCeremonyId);
    expect(setItem).toHaveBeenCalledWith('events', { '1234': degreeCeremony });
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

    expect(setItem).toHaveBeenCalledWith('events', { '1234': degreeCeremony });
  });

  test('calling reserveTicket with no more tickets available throws an error', async () => {
    const degreeCeremonyWithNoMoreTickets: PersistedEvent = {
      ...degreeCeremonyPersisted,
      ticketsSold: 1000,
    };
    await loadEventsForTest([degreeCeremonyWithNoMoreTickets]);

    expect(() => reserveTicketForEvent(degreeCeremonyId)).toThrow();
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

    await loadEventsForTest([
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

  test('cancelTicketReservationForEvent decreases ticketsSold by 1', async () => {
    const degreeCeremonyWithNoTickets: Partial<PersistedEvent> = {
      ...degreeCeremonyPersisted,
      ticketsSold: 1000,
    };

    await loadEventsForTest([degreeCeremonyWithNoTickets as PersistedEvent]);

    cancelTicketReservationForEvent(degreeCeremonyWithNoTickets.id);

    expect(setItem).toHaveBeenCalledWith('events', {
      '1234': {
        ...degreeCeremonyWithNoTickets,
        date: new Date(degreeCeremonyWithNoTickets.date),
        ticketsSold: 999,
      },
    });
  });

  test('cancelTicketReservationForEvent does not change event if there are no sold tickets', async () => {
    cancelTicketReservationForEvent(degreeCeremonyId);

    expect(setItem).toHaveBeenCalledWith('events', {
      '1234': { ...degreeCeremony, ticketsSold: 0 },
    });
  });
});
