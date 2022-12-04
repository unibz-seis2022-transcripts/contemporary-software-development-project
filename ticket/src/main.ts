import express from 'express';
import { deleteTicketHandler } from './handlers/deleteTicket.js';
import { getTicketsHandler } from './handlers/getTickets.js';
import { reserveTicketHandler } from './handlers/reserveTicket.js';
import { searchTicketsHandler } from './handlers/searchTickets.js';
import { initEvents } from './model/event.js';
import { initStorage } from './model/persist.js';
import { initTickets } from './model/ticket.js';
import { getIpAddress } from './networking/ipAddress.js';
import {
  getMessageQueueAddress,
  registerService,
} from './networking/registry.js';
import { initializeQueue } from './networking/message-queue.js';

await initStorage('./storage');
await initEvents();
await initTickets();

const app = express();
const port = 3002;
const serviceName = 'ticket';
const ipAddress = getIpAddress();

await registerService(serviceName, ipAddress, port);
const messageQueueAddress = await getMessageQueueAddress();

await initializeQueue(messageQueueAddress);

app.get('/', (req, res) => {
  res.send('Hello world from the ticket service!');
});

const router = express.Router();
router.get('/searchTickets', searchTicketsHandler);

router.post('/reserveticket', reserveTicketHandler);
router.post('/deleteticket', deleteTicketHandler);
router.get('/tickets', getTicketsHandler);

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on IP address ${ipAddress} on port ${port}`);
});
