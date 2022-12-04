import amqplib from 'amqplib';
import promiseRetry from 'promise-retry';
import { addEvent, deleteEvent } from '../model/event.js';
import { deleteTicketsForEvent } from '../model/ticket.js';

let senderChannel: amqplib.Channel;
let receiverChannel: amqplib.Channel;
const ticketsTopic = 'tickets';
const eventsTopic = 'events';

const attemptConnection = async (
  address: string,
): Promise<amqplib.Connection> => {
  let conn: amqplib.Connection;

  await promiseRetry(
    async function (retry, attemptNumber) {
      console.log(
        `Trying to connect to message queue, attempt ${attemptNumber}`,
      );

      try {
        conn = await amqplib.connect(`amqp://${address}`);
      } catch (error) {
        retry(error);
      }
    },
    { retries: 5 },
  );

  return conn;
};

const processMessage = (message: string): void => {
  const messageObject = JSON.parse(message);
  if (messageObject.action === 'create-event') {
    addEvent(messageObject.event);
  }

  if (messageObject.action === 'delete-event') {
    const eventId = messageObject.eventId;
    deleteEvent(eventId);
    deleteTicketsForEvent(eventId);
  }
};

export const initializeQueue = async (address: string): Promise<void> => {
  const conn = await attemptConnection(address);
  console.log('Connected to message queue');

  senderChannel = await conn.createChannel();
  receiverChannel = await conn.createChannel();

  await senderChannel.assertQueue(ticketsTopic);
  await receiverChannel.assertQueue(eventsTopic);

  receiverChannel.consume(eventsTopic, (msg) => {
    if (msg) {
      console.log('Received:', msg.content.toString());
      receiverChannel.ack(msg);
      processMessage(msg.content.toString());
    } else {
      console.log('Consumer cancelled by server');
    }
  });
};

const sendMessage = (message: string): void => {
  if (!senderChannel) {
    throw new Error('Sender channel undefined. Did you initialize the queue?');
  }

  if (!message) {
    return;
  }

  senderChannel.sendToQueue(ticketsTopic, Buffer.from(message));
};

export const sendReservedTicket = (eventId: string): void => {
  const messageObject = {
    action: 'reserve-ticket',
    eventId,
  };
  sendMessage(JSON.stringify(messageObject));
};

export const sendCancelledTicket = (eventId: string): void => {
  const messageObject = {
    action: 'cancel-ticket',
    eventId,
  };
  sendMessage(JSON.stringify(messageObject));
};
