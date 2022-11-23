import express from "express";
import { deleteTicketHandler } from "./handlers/deleteTicket.js";
import { getTicketsHandler } from "./handlers/getTickets.js";
import { reserveTicketHandler } from "./handlers/reserveTicket.js";
import { searchTicketsHandler } from "./handlers/searchTickets.js";
import { initEvents } from "./model/event.js";
import { initStorage } from "./model/persist.js";
import { initTickets } from "./model/ticket.js";

await initStorage("./storage");
await initEvents();
await initTickets();

const app = express();
const port = 3002;

app.get("/", (req, res) => {
  res.send("Hello world!");
});

const router = express.Router();
router.get("/searchTickets", searchTicketsHandler);

router.post("/reserveticket", reserveTicketHandler);
router.post("/deleteticket", deleteTicketHandler);
router.get("/tickets", getTicketsHandler);

app.use(router);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
