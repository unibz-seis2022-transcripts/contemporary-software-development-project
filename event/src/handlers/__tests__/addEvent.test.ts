import { NextFunction, Request, Response } from 'express';
import { addEvent, DuplicateEventError } from '../../model/event.js';
import { addEventHandler } from '../addEvent.js';
import { createMock } from 'ts-auto-mock';
import { Event } from '../../types.js';
import { sendCreatedEvent } from '../../networking/message-queue.js';

jest.mock('../../model/event.js');
jest.mock('../../networking/message-queue.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('add event handler', () => {
  const mockCreatedEvent = { id: '1234' } as Partial<Event>;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.mocked(addEvent).mockReturnValue(mockCreatedEvent as Event);
  });

  const degreeCeremonyParams = {
    name: 'Degree ceremony',
    date: '2022-10-08',
    tickets: '1000',
  };

  const tddHandsOnParams = {
    name: 'TDD Hands-on',
    date: '2022-10-14',
    tickets: '20',
  };

  it('takes name, date and ticket count from the request', () => {
    req.query = degreeCeremonyParams;

    addEventHandler(req, res, next);
    expect(addEvent).toHaveBeenCalledWith({
      name: degreeCeremonyParams.name,
      date: degreeCeremonyParams.date,
      ticketsTotal: +degreeCeremonyParams.tickets,
    });

    jest.clearAllMocks();

    req.query = tddHandsOnParams;

    addEventHandler(req, res, next);
    expect(addEvent).toHaveBeenCalledWith({
      name: tddHandsOnParams.name,
      date: tddHandsOnParams.date,
      ticketsTotal: +tddHandsOnParams.tickets,
    });
  });

  it('sends the id of the created event with HTTP status 201', () => {
    req.query = degreeCeremonyParams;

    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    addEventHandler(req, res, next);
    expect(resSendMock).toHaveBeenCalledWith({ eventId: mockCreatedEvent.id });
    expect(resStatusMock).toHaveBeenCalledWith(201);

    jest.clearAllMocks();

    const tddHandsOnEvent = { id: '5678' } as Partial<Event>;

    jest.mocked(addEvent).mockReturnValue(tddHandsOnEvent as Event);
    req.query = tddHandsOnParams;

    addEventHandler(req, res, next);
    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith({ eventId: tddHandsOnEvent.id });
    expect(resStatusMock).toHaveBeenCalledWith(201);
  });

  it('sends a message to the mq with the newly created event', () => {
    req.query = degreeCeremonyParams;

    addEventHandler(req, res, next);
    expect(sendCreatedEvent).toHaveBeenCalledWith(mockCreatedEvent);
  });

  it('sends an error message and HTTP status 400 if the event already exists', () => {
    jest.mocked(addEvent).mockImplementation(() => {
      throw new DuplicateEventError();
    });

    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    addEventHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith({
      message: 'Duplicate event error',
      status: 400,
    });
    expect(resStatusMock).toHaveBeenCalledWith(400);
    expect(sendCreatedEvent).not.toHaveBeenCalled();
  });

  it('sends an error message and HTTP status 500 if any other error occurs', () => {
    jest.mocked(addEvent).mockImplementation(() => {
      throw new Error();
    });
    jest.mocked(console.log);

    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    addEventHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith('An unknown error occured.');
    expect(resStatusMock).toHaveBeenCalledWith(500);
    expect(sendCreatedEvent).not.toHaveBeenCalled();
  });
});
