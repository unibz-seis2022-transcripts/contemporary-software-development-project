import { reserveTicketHandler } from '../reserveTicket.js';
import { reserveTicket } from '../../model/ticket.js';
import { createMock } from 'ts-auto-mock';
import { NextFunction, Request, Response } from 'express';
import { EventSoldOutError, reserveTicketForEvent } from '../../model/event.js';
import { sendReservedTicket } from '../../networking/message-queue.js';

jest.mock('../../model/ticket.js');
jest.mock('../../model/event.js');
jest.mock('../../networking/message-queue.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('reserve ticket handler', () => {
  const ticketRequest = {
    name: 'Mickey Mouse',
    event: 'an event id',
  };
  const ticketId = '1234';

  beforeAll(() => {
    req.query = ticketRequest;
    res.send = jest.fn();

    jest.mocked(reserveTicket).mockReturnValue(ticketId);

    reserveTicketHandler(req, res, next);
  });

  it('reserves a ticket', () => {
    expect(reserveTicketForEvent).toHaveBeenCalledTimes(1);
    expect(reserveTicketForEvent).toHaveBeenCalledWith(ticketRequest.event);
    expect(reserveTicket).toHaveBeenCalledTimes(1);
    expect(reserveTicket).toHaveBeenCalledWith({
      owner: ticketRequest.name,
      eventId: ticketRequest.event,
    });
  });

  it('sends the ticket id as response', () => {
    expect(res.send).toHaveBeenCalledTimes(1);
    expect(res.send).toHaveBeenCalledWith({ ticketId });
  });

  it('sends the id of the affected event to the message queue', () => {
    expect(sendReservedTicket).toHaveBeenCalledTimes(1);
    expect(sendReservedTicket).toHaveBeenCalledWith(ticketRequest.event);
  });

  describe('given no more tickets are available', () => {
    beforeAll(() => {
      jest.mocked(reserveTicketForEvent).mockImplementation(() => {
        throw new EventSoldOutError();
      });

      res.send = jest.fn();
      res.status = jest.fn();

      reserveTicketHandler(req, res, next);
    });

    it('sends an error message', () => {
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith('Event sold out.');
    });

    it('sends HTTP status code 400', () => {
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe('given any other error occurs', () => {
    beforeAll(() => {
      jest.mocked(reserveTicketForEvent).mockImplementation(() => {
        throw new Error();
      });

      res.send = jest.fn();
      res.status = jest.fn();

      reserveTicketHandler(req, res, next);
    });

    it('sends an error message', () => {
      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith('An unexpected error occured.');
    });

    it('sends HTTP status code 500', () => {
      expect(res.status).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(500);
    });
  });
});
