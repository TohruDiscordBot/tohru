FROM node:18-alpine3.16

ARG PORT
ARG AUTH_TOKEN
ARG PASSWORD
ARG HOST
ARG IDENTITY
ARG AGENT
ARG DISCORD_TOKEN
ARG DISCORD_DEV_GUILD_ID
ARG NODE_ENV
ARG MONGODB_URL
ARG MONGODB_DB_NAME

ENV PORT=${PORT}
ENV AGENT=${AGENT}
ENV PASSWORD=${PASSWORD}
ENV HOST=${HOST}
ENV IDENTITY=${IDENTITY}
ENV DISCORD_TOKEN=${DISCORD_TOKEN}
ENV DISCORD_DEV_GUILD_ID=${DISCORD_DEV_GUILD_ID}
ENV NODE_ENV=${NODE_ENV}
ENV MONGODB_URL=${MONGODB_URL}
ENV MONGODB_DB_NAME=${MONGODB_URL}

WORKDIR /usr/tohru
COPY package.json package.json

RUN ["npm", "install"]

COPY . .

RUN ["npm", "run", "build"]

CMD if [ "$AGENT" = "BOT" ]; then npm start; else npm run startBridge; fi