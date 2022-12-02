import { NextFunction, Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { searchTickets } from '../../model/event.js';
import { Event } from '../../types.js';
import { searchTicketsHandler } from '../searchTickets.js';

jest.mock('../../model/event.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('search tickets handler', () => {
  it('returns tickets matching the search parameters', () => {
    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    const degreeCeremony: Event = {
      id: '1234',
      date: new Date('2022-10-08'),
      name: 'Degree ceremony',
      ticketsTotal: 1000,
      ticketsSold: 950,
    };

    jest.mocked(searchTickets).mockReturnValue([degreeCeremony]);

    const desiredTickets = '10';
    const desiredDate = '2022-10-08';
    req.query = { date: desiredDate, tickets: desiredTickets };
    searchTicketsHandler(req, res, next);

    expect(searchTickets).toHaveBeenCalledTimes(1);
    expect(searchTickets).toHaveBeenCalledWith(
      +desiredTickets,
      new Date(desiredDate),
    );

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith({ events: [degreeCeremony] });
    expect(resStatusMock).toHaveBeenCalledWith(200);
  });
});
