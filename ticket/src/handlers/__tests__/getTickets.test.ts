import { NextFunction, Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { getTickets } from '../../model/ticket.js';
import { Ticket } from '../../types.js';
import { getTicketsHandler } from '../getTickets.js';

jest.mock('../../model/ticket.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('get tickets handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns all stored tickets', () => {
    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    const degreeCeremonyTicket: Ticket = {
      id: '1234',
      soldOn: new Date('2022-10-08'),
      owner: 'Jane Doe',
      eventId: '1234',
    };

    const christmasTicket: Ticket = {
      id: '5678',
      soldOn: new Date('2022-12-24'),
      owner: 'Santa Claus',
      eventId: '5678',
    };

    const tickets: Ticket[] = [degreeCeremonyTicket, christmasTicket];
    jest.mocked(getTickets).mockReturnValue(tickets);

    getTicketsHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith({ tickets });
    expect(resStatusMock).toHaveBeenCalledWith(200);
  });
});
