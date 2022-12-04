import { NextFunction, Request, Response } from 'express';
import { createMock } from 'ts-auto-mock';
import { deleteEvent } from '../../model/event.js';
import { deleteEventHandler } from '../deleteEvent.js';

jest.mock('../../model/event.js');
// TODO: assert that message queue methods are called
jest.mock('../../networking/message-queue.js');

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

  it.skip('deletes the related tickets', () => {
    // TODO (2022-11-23): assert tickets are being deleted
  });
});
