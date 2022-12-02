import express from 'express';
import { addEventHandler } from './handlers/addEvent.js';
import { deleteEventHandler } from './handlers/deleteEvent.js';
import { getEventsHandler } from './handlers/getEvents.js';
import { initEvents } from './model/event.js';
import { initStorage } from './model/persist.js';
import Consul from 'consul';

await initStorage('./storage');
await initEvents();

const app = express();
const port = 3001;
const serviceName = 'event';

const consul = new Consul({ host: 'consul', port: '8500' });
await consul.agent.service.register(serviceName);

app.get('/', (req, res) => {
  res.send('Hello world!');
});

const router = express.Router();
router.post('/addEvent', addEventHandler);
router.post('/deleteevent', deleteEventHandler);
router.get('/events', getEventsHandler);

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
