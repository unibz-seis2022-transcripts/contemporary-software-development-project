import express from 'express';
import { addEventHandler } from './handlers/addEvent.js';
import { deleteEventHandler } from './handlers/deleteEvent.js';
import { initEvents } from './model/event.js';

await initEvents();

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('Hello world!');
});

const router = express.Router();
router.post('/addEvent', addEventHandler);
router.post('/deleteevent', deleteEventHandler);

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
