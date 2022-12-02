FROM node:16
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY ./build/src .
EXPOSE 3002
CMD [ "node", "main.js" ]
