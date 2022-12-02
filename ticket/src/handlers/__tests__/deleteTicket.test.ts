import { Request, Response, NextFunction } from 'express';
import { createMock } from 'ts-auto-mock';
import { cancelTicketReservationForEvent } from '../../model/event.js';
import { deleteTicket } from '../../model/ticket.js';
import { deleteTicketHandler } from '../deleteTicket.js';

jest.mock('../../model/event.js');
jest.mock('../../model/ticket.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('delete ticket handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should delete the desired ticket', () => {
    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    jest.mocked(deleteTicket).mockReturnValue('');

    const ticketId = '1234';
    req.query = { id: ticketId };
    deleteTicketHandler(req, res, next);

    expect(deleteTicket).toHaveBeenCalledTimes(1);
    expect(deleteTicket).toHaveBeenCalledWith(ticketId);

    expect(cancelTicketReservationForEvent).not.toHaveBeenCalled();

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resStatusMock).toHaveBeenCalledWith(200);
  });

  describe('given the ticket actually existed', () => {
    it('should increment the number of tickets available for the linked event', () => {
      const resSendMock = jest.fn();
      const resStatusMock = jest.fn().mockReturnValue(res);
      res.send = resSendMock;
      res.status = resStatusMock;

      const eventId = '5678';
      jest.mocked(deleteTicket).mockReturnValue(eventId);

      const ticketId = '1234';
      req.query = { id: ticketId };
      deleteTicketHandler(req, res, next);

      expect(deleteTicket).toHaveBeenCalledTimes(1);
      expect(deleteTicket).toHaveBeenCalledWith(ticketId);

      expect(cancelTicketReservationForEvent).toHaveBeenCalledWith(eventId);
      expect(cancelTicketReservationForEvent).toHaveBeenCalledTimes(1);

      expect(resSendMock).toHaveBeenCalledTimes(1);
      expect(resStatusMock).toHaveBeenCalledWith(200);
    });
  });
});
