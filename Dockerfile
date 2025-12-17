FROM node:18-alpine

WORKDIR /app

COPY predict/package*.json ./

RUN npm install

COPY predict/ ./

EXPOSE 3002

CMD ["node", "server.js"]