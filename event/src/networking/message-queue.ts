import amqplib from 'amqplib';
import promiseRetry from 'promise-retry';
import {
  cancelTicketReservationForEvent,
  reserveTicketForEvent,
} from '../model/event.js';
import { Event } from '../types.js';

let senderChannel: amqplib.Channel;
let receiverChannel: amqplib.Channel;
const eventsTopic = 'events';
const ticketsTopic = 'tickets';

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
  if (messageObject.action === 'reserve-ticket') {
    reserveTicketForEvent(messageObject.eventId);
  }

  if (messageObject.action === 'cancel-ticket') {
    cancelTicketReservationForEvent(messageObject.eventId);
  }
};

export const initializeQueue = async (address: string): Promise<void> => {
  const conn = await attemptConnection(address);
  console.log('Connected to message queue');

  senderChannel = await conn.createChannel();
  receiverChannel = await conn.createChannel();

  await senderChannel.assertQueue(eventsTopic);
  await receiverChannel.assertQueue(ticketsTopic);

  receiverChannel.consume(ticketsTopic, (msg) => {
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

  senderChannel.sendToQueue(eventsTopic, Buffer.from(message));
};

export const sendCreatedEvent = (event: Event): void => {
  const messageObject = {
    action: 'create-event',
    event,
  };
  sendMessage(JSON.stringify(messageObject));
};

export const sendDeletedEvent = (eventId: string): void => {
  const messageObject = {
    action: 'delete-event',
    eventId,
  };
  sendMessage(JSON.stringify(messageObject));
};
