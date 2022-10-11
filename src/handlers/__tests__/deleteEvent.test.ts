import { NextFunction, Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { deleteEvent } from '../../model/event.js';
import { deleteTicketsForEvent } from '../../model/ticket.js';
import { deleteEventHandler } from '../deleteEvent.js';

jest.mock('../../model/event.js');
jest.mock('../../model/ticket.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('delete event handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('deletes the event with the provided id', () => {
    const id1 = '1234';
    req.query = { id: id1 };
    deleteEventHandler(req, res, next);
    expect(deleteEvent).toHaveBeenCalledWith(id1);

    const id2 = '5678';
    req.query = { id: id2 };
    deleteEventHandler(req, res, next);
    expect(deleteEvent).toHaveBeenCalledWith(id2);
  });

  it('sends a success message', () => {
    const resSendMock = jest.fn();
    res.send = resSendMock;
    const resStatusMock = jest.fn();
    res.status = resStatusMock;

    deleteEventHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalled();
    expect(resStatusMock).toHaveBeenCalledWith(200);
  });

  it('deletes the related tickets', () => {
    const id1 = '1234';
    req.query = { id: id1 };

    deleteEventHandler(req, res, next);

    expect(deleteTicketsForEvent).toHaveBeenCalledTimes(1);
    expect(deleteTicketsForEvent).toHaveBeenCalledWith(id1);

    jest.clearAllMocks();

    const id2 = '5678';
    req.query = { id: id2 };

    deleteEventHandler(req, res, next);

    expect(deleteTicketsForEvent).toHaveBeenCalledTimes(1);
    expect(deleteTicketsForEvent).toHaveBeenCalledWith(id2);
  });
});
