import express from 'express';
import { addEventHandler } from './handlers/addEvent.js';
import { deleteEventHandler } from './handlers/deleteEvent.js';
import { getEventsHandler } from './handlers/getEvents.js';
import { initEvents } from './model/event.js';
import { initStorage } from './model/persist.js';
import { initializeQueue } from './networking/message-queue.js';
import {
  getMessageQueueAddress,
  registerService,
} from './networking/registry.js';
import { getIpAddress } from './networking/ipAddress.js';

await initStorage('./storage');
await initEvents();

const app = express();
const port = 3001;
const serviceName = 'event';
const ipAddress = getIpAddress();

await registerService(serviceName, ipAddress, port);
const messageQueueAddress = await getMessageQueueAddress();

await initializeQueue(messageQueueAddress);

app.get('/', (req, res) => {
  res.send('Hello world from the event service!');
});

throw Error('This is intended to let the app fail');

const router = express.Router();
router.post('/addEvent', addEventHandler);
router.post('/deleteevent', deleteEventHandler);
router.get('/events', getEventsHandler);

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on IP address ${ipAddress} on port ${port}`);
});
