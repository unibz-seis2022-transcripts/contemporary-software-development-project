import { Request, Response, NextFunction } from 'express';
import { createMock } from 'ts-auto-mock';
import { cancelTicketReservationForEvent } from '../../model/event.js';
import { deleteTicket } from '../../model/ticket.js';
import { sendCancelledTicket } from '../../networking/message-queue.js';
import { deleteTicketHandler } from '../deleteTicket.js';

jest.mock('../../model/event.js');
jest.mock('../../model/ticket.js');
jest.mock('../../networking/message-queue.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('delete ticket handler', () => {
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
    const eventId = '5678';
    const ticketId = '1234';

    beforeAll(() => {
      jest.clearAllMocks();

      res.send = jest.fn();
      res.status = jest.fn().mockReturnValue(res);

      jest.mocked(deleteTicket).mockReturnValue(eventId);

      req.query = { id: ticketId };
      deleteTicketHandler(req, res, next);
    });

    it('should increment the number of tickets available for the linked event', () => {
      expect(deleteTicket).toHaveBeenCalledTimes(1);
      expect(deleteTicket).toHaveBeenCalledWith(ticketId);

      expect(cancelTicketReservationForEvent).toHaveBeenCalledTimes(1);
      expect(cancelTicketReservationForEvent).toHaveBeenCalledWith(eventId);

      expect(res.send).toHaveBeenCalledTimes(1);
      expect(res.status).toHaveBeenCalledWith(200);
    });

    it('should send the id of the affected event to the queue', () => {
      expect(sendCancelledTicket).toHaveBeenCalledTimes(1);
      expect(sendCancelledTicket).toHaveBeenCalledWith(eventId);
    });
  });
});
