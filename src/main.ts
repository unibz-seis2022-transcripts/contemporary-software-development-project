import express from 'express';
import { addEventHandler } from './handlers/addEvent.js';
import { deleteEventHandler } from './handlers/deleteEvent.js';
import { deleteTicketHandler } from './handlers/deleteTicket.js';
import { getEventsHandler } from './handlers/getEvents.js';
import { reserveTicketHandler } from './handlers/reserveTicket.js';
import { initEvents } from './model/event.js';
import { initTickets } from './model/ticket.js';

await initEvents();
await initTickets();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello world!');
});

const router = express.Router();
router.post('/addEvent', addEventHandler);
router.post('/deleteevent', deleteEventHandler);
router.get('/events', getEventsHandler);
router.post('/reserveticket', reserveTicketHandler);
router.post('deleteTicket', deleteTicketHandler);

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
