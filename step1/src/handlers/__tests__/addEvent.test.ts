import { NextFunction, Request, Response } from 'express';
import { addEvent, DuplicateEventError } from '../../model/event.js';
import { addEventHandler } from '../addEvent.js';
import { createMock } from 'ts-auto-mock';

jest.mock('../../model/event.js');

const req = createMock<Request>();
const res = createMock<Response>();
const next = createMock<NextFunction>();

describe('add event handler', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('adds an event to the db', () => {
    addEventHandler(req, res, next);
    expect(addEvent).toHaveBeenCalled();
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
    const degreeCeremonyMockId = '1234';
    jest.mocked(addEvent).mockReturnValue(degreeCeremonyMockId);
    req.query = degreeCeremonyParams;

    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    addEventHandler(req, res, next);
    expect(resSendMock).toHaveBeenCalledWith({ eventId: degreeCeremonyMockId });
    expect(resStatusMock).toHaveBeenCalledWith(201);

    jest.clearAllMocks();

    const tddHandsOnId = '5678';
    jest.mocked(addEvent).mockReturnValue(tddHandsOnId);
    req.query = tddHandsOnParams;

    addEventHandler(req, res, next);
    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith({ eventId: tddHandsOnId });
    expect(resStatusMock).toHaveBeenCalledWith(201);
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
    expect(resSendMock).toHaveBeenCalledWith('Duplicate Event Error.');
    expect(resStatusMock).toHaveBeenCalledWith(400);
  });

  it('sends an error message and HTTP status 500 if any other error occurs', () => {
    jest.mocked(addEvent).mockImplementation(() => {
      throw new Error();
    });

    const resSendMock = jest.fn();
    const resStatusMock = jest.fn().mockReturnValue(res);
    res.send = resSendMock;
    res.status = resStatusMock;

    addEventHandler(req, res, next);

    expect(resSendMock).toHaveBeenCalledTimes(1);
    expect(resSendMock).toHaveBeenCalledWith('An unknown error occured.');
    expect(resStatusMock).toHaveBeenCalledWith(500);
  });
});
