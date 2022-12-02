import { NextFunction, Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getEvents } from '../../model/event.js';
import { Event } from '../../types.js';
import { getEventsHandler } from '../getEvents.js';

jest.mock('../../model/event.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('get events handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all stored events', () => {
    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    const degreeCeremony: Event = {
      id: '1234',
      date: new Date('2022-10-08'),
      name: 'Degree ceremony',
      ticketsTotal: 1000,
      ticketsSold: 999,
    };

    const christmas: Event = {
      id: '5678',
      date: new Date('2022-12-24'),
      name: 'Christmas',
      ticketsTotal: 100,
      ticketsSold: 80,
    };

    const events: Event[] = [degreeCeremony, christmas];
    jest.mocked(getEvents).mockReturnValue(events);

    getEventsHandler(req, res, next);

    const expectedEvents = events.map((event) => ({
      ...event,
      ticketsRemaining: event.ticketsTotal - event.ticketsSold,
    }));

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith({ events: expectedEvents });
    expect(resStatusMock).toHaveBeenCalledWith(200);
  });
});
