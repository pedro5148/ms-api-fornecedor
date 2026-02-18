FROM node:20-alpine

WORKDIR /app

RUN apk add --no-cache tzdata

COPY src/package.json ./

RUN npm install

COPY src/ .

EXPOSE 3333

USER node

CMD ["npm", "run", "start:prod"]