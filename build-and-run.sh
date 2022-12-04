#!/bin/bash
set -e

echo "Now building and tagging the event service"

cd event
npm run build
sudo docker build . -t teilkasko/tickent-event
echo "Successfully tagged the event service"

echo "Now building and tagging the ticket service"
cd ../ticket
npm run build
sudo docker build . -t teilkasko/tickent-ticket
echo "Successfully tagged the ticket service"

cd ../docker-compose
sudo docker-compose down
sudo docker-compose up -d

event_container_line=$(sudo docker container ls | grep event)
event_id=${event_container_line:0:12}

ticket_container_line=$(sudo docker container ls | grep ticket)
ticket_id=${ticket_container_line:0:12}

rabbitmq_container_line=$(sudo docker container ls | grep rabbitmq)
rabbitmq_id=${rabbitmq_container_line:0:12}

echo "Event container id: ${event_id}"
echo "Ticket container id: ${ticket_id}"
echo "rabbitmq container id: ${rabbitmq_id}"