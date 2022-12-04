import { reserveTicketHandler } from '../reserveTicket.js';
import { reserveTicket } from '../../model/ticket.js';
import { createMock } from 'ts-auto-mock';
import { NextFunction, Request, Response } from 'express';
import { EventSoldOutError, reserveTicketForEvent } from '../../model/event.js';

jest.mock('../../model/ticket.js');
jest.mock('../../model/event.js');
// TODO: assert that message queue methods are called
jest.mock('../../networking/message-queue.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('reserve ticket handler', () => {
  it('reserves a ticket', () => {
    const ticketRequest1 = {
      name: 'Mickey Mouse',
      event: 'an event id',
    };

    req.query = ticketRequest1;

    reserveTicketHandler(req, res, next);

    expect(reserveTicketForEvent).toHaveBeenCalledTimes(1);
    expect(reserveTicketForEvent).toHaveBeenCalledWith(ticketRequest1.event);
    expect(reserveTicket).toHaveBeenCalledTimes(1);
    expect(reserveTicket).toHaveBeenCalledWith({
      owner: ticketRequest1.name,
      eventId: ticketRequest1.event,
    });

    jest.clearAllMocks();

    const ticketRequest2 = {
      name: 'Donald Duck',
      event: 'another event id',
    };

    req.query = ticketRequest2;

    reserveTicketHandler(req, res, next);

    expect(reserveTicketForEvent).toHaveBeenCalledTimes(1);
    expect(reserveTicketForEvent).toHaveBeenCalledWith(ticketRequest2.event);
    expect(reserveTicket).toHaveBeenCalledTimes(1);
    expect(reserveTicket).toHaveBeenCalledWith({
      owner: ticketRequest2.name,
      eventId: ticketRequest2.event,
    });
  });

  it('sends the ticket id as response', () => {
    const resSendMock = jest.fn();
    res.send = resSendMock;

    const ticketId1 = '1234';
    jest.mocked(reserveTicket).mockReturnValue(ticketId1);

    reserveTicketHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith({ ticketId: ticketId1 });

    jest.clearAllMocks();

    jest.mocked(reserveTicket).mockReturnValue(ticketId1);

    reserveTicketHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith({ ticketId: ticketId1 });
  });

  it('sends an error message and HTTP status code 400 if there are no more tickets available', () => {
    jest.mocked(reserveTicketForEvent).mockImplementation(() => {
      throw new EventSoldOutError();
    });

    const resSendMock = jest.fn();
    res.send = resSendMock;

    const resStatusMock = jest.fn();
    res.status = resStatusMock;

    reserveTicketHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith('Event sold out.');
    expect(resStatusMock).toHaveBeenCalledWith(400);
  });

  it('sends an error message and HTTP status code 500 if any other error occurs', () => {
    jest.mocked(reserveTicketForEvent).mockImplementation(() => {
      throw new Error();
    });

    const resSendMock = jest.fn();
    res.send = resSendMock;

    const resStatusMock = jest.fn();
    res.status = resStatusMock;

    reserveTicketHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith('An unexpected error occured.');
    expect(resStatusMock).toHaveBeenCalledWith(500);
  });
});
