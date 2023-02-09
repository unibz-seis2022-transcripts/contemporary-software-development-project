#!/bin/bash
set -e

echo "Now building the event service"

cd event
npm run build
echo "Successfully built the event service"

echo "Now building the ticket service"
cd ../ticket
npm run build
echo "Successfully built the ticket service"

cd ../docker-compose
sudo docker-compose down
sudo docker-compose up -d --build

event_container_line=$(sudo docker container ls | grep event)
event_id=${event_container_line:0:12}
echo "Event container id: ${event_id}"

ticket_container_line=$(sudo docker container ls | grep ticket)
ticket_id=${ticket_container_line:0:12}
echo "Ticket container id: ${ticket_id}"

rabbitmq_container_line=$(sudo docker container ls | grep rabbitmq)
rabbitmq_id=${rabbitmq_container_line:0:12}
echo "rabbitmq container id: ${rabbitmq_id}"

nginx_container_line=$(sudo docker container ls | grep nginx)
nginx_id=${nginx_container_line:0:12}
echo "nginx container id: ${nginx_id}"
