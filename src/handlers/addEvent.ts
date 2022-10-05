import { RequestHandler } from 'express';

export const addEventHandler: RequestHandler = (req, res) => {
  const name = req.query['name'];
  const date = req.query['date'];
  const tickets = req.query['tickets'];

  res.send(`${name}, ${date}, ${tickets}`);
};
